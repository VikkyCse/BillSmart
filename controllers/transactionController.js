const Transaction = require('../models/Transaction');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart_Items');

const { Op } = require('sequelize');
const Item = require('../models/Item');
const sequelize = require('../models/database');
const Naturals = require('../models/Naturals');
const currentDate = new Date();

const createTransaction = async (req, res) => {
  const {
    Amount,
    Transaction_Time,
    user_id,
    coupon_id,
  } = req.body;
  

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (user.Amount < Amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await sequelize.transaction(async (t) => {
      user.Amount -= Amount;
      await user.save({ transaction: t });

      const newOrder = await Order.create({ transaction: t });
      const cart = await Cart.findOne({ where: { user_id: user.id } });

      const transaction = await Transaction.create({
        Amount,
        Transaction_Time,
        Is_completed : 0,
        user_id,
        coupon_id,
        order_id: newOrder.id,
        Type : 3,
      }, { transaction: t });

      const cartItems = await CartItem.findAll({ where: { Cart_id: cart.id } });

      const orderItems = cartItems.map(cartItem => ({
        Item_id: cartItem.Item_id,
        Count: cartItem.Count,
        orderId: newOrder.id
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      await CartItem.destroy({ where: { Cart_id: cart.id }, transaction: t });
      await Cart.destroy({ where: { user_id }, transaction: t });

      res.status(201).json(transaction);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the transaction' });
  }
};


// const createTransactionByAdmin = async (req, res) => {
//   const {
//     Amount,
//     Transaction_Time,
//     Is_completed,
//     user_id,
//     coupon_id,
//     Type,
//     items // An array of objects containing item_id and quantity
//   } = req.body;

//   try {
//     const user = await User.findByPk(user_id);
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }
//     if (user.Amount < Amount) {
//       return res.status(400).json({ error: 'Insufficient balance' });
//     }

//     await sequelize.transaction(async (t) => {
//       user.Amount -= Amount;
//       await user.save({ transaction: t });

//       const newOrder = await Order.create({ transaction: t });

//       const orderItems = items.map(item => ({
//         Item_id: item.item_id,
//         Count: item.quantity,
//         orderId: newOrder.id
//       }));

//       await OrderItem.bulkCreate(orderItems, { transaction: t });

//       const transaction = await Transaction.create({
//         Amount,
//         Transaction_Time ,
//         Is_completed,
//         user_id,
//         coupon_id,
//         order_id: newOrder.id,
//         Type
//       }, { transaction: t });

//       res.status(201).json(transaction);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error creating the transaction' });
//   }
// };

const checkQuantity = async (req, res) => {
  try { 
    const { cartItems } = req.body;

    // const availableItems = [];
    const insufficientItems = [];

    for (const cartItem of cartItems) {
      const { itemId, quantity } = cartItem;
      const item = await Item.findByPk(itemId);

      if (!item) {
        insufficientItems.push({ itemId, name: 'Item not found', availableQuantity: 0, quantity });
      } else if (item.quantity < quantity) {
        insufficientItems.push({ itemId, name: item.name, availableQuantity: item.quantity, quantity });
      } 
      // else {
      //   availableItems.push({ itemId, name: item.name, availableQuantity: item.quantity, quantity });
      // }
    }

    res.status(200).json({ insufficientItems });
  } catch (error) {
    console.error('Error checking item availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}

const createTransactionByAdmin = async (req, res) => {
  const {
    user_id,
    coupon_id,
    cartItems,
    transaction_by,
  } = req.body;

  
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(200).json({ error: 'User not found' });
    }

    const insufficientItems = [];
    const AllTransactions = [];

    await sequelize.transaction(async (t) => {
      // Calculate the total quantity and price for the items being ordered
      let totalQuantity = 0;
      let totalPrice = 0;
      // Create a new order
      
      const newOrder = await Order.create({ transaction: t });

      for (const item of cartItems) {
        const { itemId, quantity } = item;

        // Check if the item exists and if its available quantity is sufficient
        const availableItem = await Item.findByPk(itemId);
        if (!availableItem || availableItem.quantity < quantity) {
          // If insufficient quantity, add details to the insufficientItems array
          insufficientItems.push({
            itemId,
            name: availableItem ? availableItem.name : 'Item not found',
            available_quantity: availableItem ? availableItem.quantity : 0,
            ordered_quantity: quantity,
          });
        } else {
          totalQuantity += quantity;
          totalPrice += availableItem.price * quantity;

          // Deduct the ordered quantity from the available item quantity
          availableItem.quantity -= quantity;
          await availableItem.save({ transaction: t });
        }
      }

      if (insufficientItems.length > 0) {
        // Respond with details of insufficient quantity items
        return res.status(200).json({
          error: 'Insufficient quantity for one or more items',
          insufficientItems,
        });
      }


      else if (user.amount < totalPrice) {
        return res.status(200).json({ error: 'Insufficient balance' });
      }

      else{
      user.amount -= totalPrice;
      await user.save({ transaction: t });
      
      // Create order items associated with the new order
      const orderItems = cartItems.map(item => ({
        Item_id: item.itemId,
        Quantity: item.quantity,
        orderId: newOrder.id,
        cost : item.cost
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      // Create a new transaction record
      const transactionitem = await Transaction.create({
        Amount: totalPrice,
        Transaction_Time : currentDate,
        Is_completed:true,
        user_id,
        coupon_id,
        order_id: newOrder.id,
        transactiontype:3,
        transaction_by:transaction_by,
      }, { transaction: t });
      AllTransactions.push(transactionitem)
    }

      res.status(201).json(AllTransactions);
    });
  } catch (error) {

    console.error(error);
    res.status(200).json({ error: 'Error creating the transaction'  });
  }
};
const createNaturalTransactionByAdmin = async (req, res) => {
  const {
    Amount,
    user_id,
    coupon_id,
    NaturalItems,
    
  } = req.body;
  const currenDate = new Date();
  
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(200).json({ error: 'User not found' });
    }

    const AllTransactions = [];

    await sequelize.transaction(async (t) => {
           
      

    if (NaturalItems.length == 1){
      const availableItem = await Item.findByPk(NaturalItems[0].itemId)
      if (user.amount < availableItem.price) {
        return res.status(200).json({ error: 'Insufficient balance' });
      }

      if(availableItem==null){
        return res.status(200).json({ error: 'Item Not Found' });
        
      }

      if (user.isHosteller != true) {
  
        if (user.amount < Amount) {
          return res.status(200).json({ error: 'Insufficient balance' });
        }
         else{

          const Natorder = await Order.create({ transaction: t });
          const NaturalItem = {
            Item_id: availableItem.id,
            Quantity: 1,
            orderId: Natorder.id,
            cost : availableItem.price
          };
          await OrderItem.create(NaturalItem, { transaction: t });
          await Naturals.create({ user_id, time:currenDate ,Amount:availableItem.price },{ transaction: t });

          const naturaldayscolarTransaction = await Transaction.create({
            Amount: availableItem.price,
            Transaction_Time: currenDate,
            Is_completed: Iscompleted,
            order_id: Natorder.id, 
            transactiontype: user.gender==0? 7:6, 
            user_id, 
          },{ transaction: t });
          AllTransactions.push(naturaldayscolarTransaction)
          user.amount -=  availableItem.price;
          await user.save({ transaction: t });
        }
      }

    else{

        if (user.gender == 0) {
         
          if (user.natural_amt < availableItem.price) {
            return res.status(200).json({ error: 'Insufficient balance' });
        }
        user.natural_amt -= availableItem.price;
        await user.save({ transaction: t });
        
        const Natorder = await Order.create({ transaction: t });
        const NaturalItem = {
          Item_id: availableItem.id,
          Quantity: 1,
          orderId: Natorder.id,
          cost : availableItem.price
        };

        
        await OrderItem.create(NaturalItem, { transaction: t });
        
        await Naturals.create({ user_id, time:currenDate ,Amount:availableItem.price },{ transaction: t });
        
        const naturalWomanTransaction = await Transaction.create({
          Amount: availableItem.price,
          Transaction_Time: currenDate,
          Is_completed: Iscompleted,
          order_id: Natorder.id, 
          transactiontype: 2, 
          user_id, 
        },{ transaction: t });
        console.log(naturalWomanTransaction)
        AllTransactions.push(naturalWomanTransaction)
      } else {
        // const currentDate = new Date();
        const lastEntry = await Naturals.findOne({
          where: {
            user_id,
            time: {
              [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
              [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
            },
          },
        });
  
        if (!lastEntry) {

          
        const Natorder = await Order.create({ transaction: t });
        const NaturalItem = {
          Item_id: availableItem.id,
          Quantity: 1,
          orderId: Natorder.id,
          cost : availableItem.price
        };
        await OrderItem.create(NaturalItem, { transaction: t });

        await Naturals.create({ user_id, time:currenDate, Amount: availableItem.price },{ transaction: t });
        const createdTransaction = await Transaction.create({
            Amount:availableItem.price,
            Transaction_Time: currenDate,
            Is_completed: true,
            order_id: Natorder.id, 
            transactiontype: 5, 
            user_id, 
          },{ transaction: t });
          AllTransactions.push(createdTransaction)
        } else {
          return res.status(200).json({ error: 'Boys can only have one Naturals entry per month' });
        }
      }
    }
  }
      res.status(201).json(AllTransactions);
    });
  } catch (error) {

    console.error(error);
    res.status(200).json({ error: 'Error creating the transaction'  });
  }
};



const createTransactionByUser = async (req, res) => {
  const {
    Amount,
    user_id,
    coupon_id,
    cartItems,
    NaturalItems,
    Iscompleted
  } = req.body;
  const currenDate = new Date();
  
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(200).json({ error: 'User not found' });
    }

    const insufficientItems = [];
    const AllTransactions = [];

    await sequelize.transaction(async (t) => {
      // Calculate the total quantity and price for the items being ordered
      let totalQuantity = 0;
      let totalPrice = 0;
      // Create a new order
      
      const newOrder = await Order.create({ transaction: t });

    if (NaturalItems.length == 1){
      const availableItem = await Item.findByPk(NaturalItems[0].itemId)
      if (user.amount < availableItem.price) {
        return res.status(200).json({ error: 'Insufficient balance' });
      }

      if(availableItem==null){
        return res.status(200).json({ error: 'Item Not Found' });
        
      }

      if (user.isHosteller != true) {
  
        if (user.amount < Amount) {
          return res.status(200).json({ error: 'Insufficient balance' });
        }
         else{

          const Natorder = await Order.create({ transaction: t });
          const NaturalItem = {
            Item_id: availableItem.id,
            Quantity: 1,
            orderId: Natorder.id,
            cost : availableItem.price
          };
          await OrderItem.create(NaturalItem, { transaction: t });
          await Naturals.create({ user_id, time:currenDate ,Amount:availableItem.price },{ transaction: t });

          const naturaldayscolarTransaction = await Transaction.create({
            Amount: availableItem.price,
            Transaction_Time: currenDate,
            Is_completed: Iscompleted,
            order_id: Natorder.id, 
            transactiontype: user.gender==0? 7:6, 
            user_id, 
          },{ transaction: t });
          AllTransactions.push(naturaldayscolarTransaction)
          user.amount -=  availableItem.price;
          await user.save({ transaction: t });
        }
      }

    else{

        if (user.gender == 0) {
         
          if (user.natural_amt < availableItem.price) {
            return res.status(200).json({ error: 'Insufficient balance' });
        }
        user.natural_amt -= availableItem.price;
        await user.save({ transaction: t });
        
        const Natorder = await Order.create({ transaction: t });
        const NaturalItem = {
          Item_id: availableItem.id,
          Quantity: 1,
          orderId: Natorder.id,
          cost : availableItem.price
        };

        
        await OrderItem.create(NaturalItem, { transaction: t });
        
        await Naturals.create({ user_id, time:currenDate ,Amount:availableItem.price },{ transaction: t });
        
        const naturalWomanTransaction = await Transaction.create({
          Amount: availableItem.price,
          Transaction_Time: currenDate,
          Is_completed: Iscompleted,
          order_id: Natorder.id, 
          transactiontype: 2, 
          user_id, 
        },{ transaction: t });
        console.log(naturalWomanTransaction)
        AllTransactions.push(naturalWomanTransaction)
      } else {
        // const currentDate = new Date();
        const lastEntry = await Naturals.findOne({
          where: {
            user_id,
            time: {
              [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
              [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
            },
          },
        });
  
        if (!lastEntry) {

          
        const Natorder = await Order.create({ transaction: t });
        const NaturalItem = {
          Item_id: availableItem.id,
          Quantity: 1,
          orderId: Natorder.id,
          cost : availableItem.price
        };
        await OrderItem.create(NaturalItem, { transaction: t });

        await Naturals.create({ user_id, time:currenDate, Amount: availableItem.price },{ transaction: t });
        const createdTransaction = await Transaction.create({
            Amount:availableItem.price,
            Transaction_Time: currenDate,
            Is_completed: true,
            order_id: Natorder.id, 
            transactiontype: 5, 
            user_id, 
          },{ transaction: t });
          AllTransactions.push(createdTransaction)
        } else {
          return res.status(200).json({ error: 'Boys can only have one Naturals entry per month' });
        }
      }
    }
  }

  if(cartItems.length>=1){

  

      for (const item of cartItems) {
        const { itemId, quantity , cost} = item;

        // Check if the item exists and if its available quantity is sufficient
        const availableItem = await Item.findByPk(itemId);
        if (!availableItem || availableItem.quantity < quantity) {
          // If insufficient quantity, add details to the insufficientItems array
          insufficientItems.push({
            itemId,
            name: availableItem ? availableItem.name : 'Item not found',
            available_quantity: availableItem ? availableItem.quantity : 0,
            ordered_quantity: quantity,
          });
        } else {
          totalQuantity += quantity;
          totalPrice += availableItem.price * quantity;

          // Deduct the ordered quantity from the available item quantity
          availableItem.quantity -= quantity;
          await availableItem.save({ transaction: t });
        }
      }

      if (insufficientItems.length > 0) {
        // Respond with details of insufficient quantity items
        return res.status(200).json({
          error: 'Insufficient quantity for one or more items',
          insufficientItems,
        });
      }


      else if (user.amount < totalPrice) {
        return res.status(200).json({ error: 'Insufficient balance' });
      }

      else{
      user.amount -= totalPrice;
      await user.save({ transaction: t });

      

      // Create order items associated with the new order
      const orderItems = cartItems.map(item => ({
        Item_id: item.itemId,
        Quantity: item.quantity,
        orderId: newOrder.id,
        cost : item.cost
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      // Create a new transaction record
      const transactionitem = await Transaction.create({
        Amount: totalPrice,
        Transaction_Time : currentDate,
        Is_completed:Iscompleted,
        user_id,
        coupon_id,
        order_id: newOrder.id,
        transactiontype:3
      }, { transaction: t });
      AllTransactions.push(transactionitem)
    }}

      res.status(201).json(AllTransactions);
    });
  } catch (error) {

    console.error(error);
    res.status(200).json({ error: 'Error creating the transaction'  });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(200).json({ error: 'Error fetching transactions' });
  }
};

const getAllTransactionsbyUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const transactions = await Transaction.findAll({ where: { user_id: userid } });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};
const getIncompleteTransactionsbyUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const transactions = await Transaction.findAll({
      where: {
        user_id: userid,
        Is_completed: 0
      }
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};


const getTransactionById = async (req, res) => {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transaction by ID' });
  }
};

const updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const {
    Amount,
    Transaction_Time,
    Is_completed,
    user_id,
    coupon_id,
    cart_item_id,
    Type
  } = req.body;

  try {
    await Transaction.update(
      { Amount, Transaction_Time, Is_completed, user_id, coupon_id, cart_item_id, Type },
      { where: { id: transactionId } }
    );
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating the transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;

  try {
    await Transaction.destroy({ where: { id: transactionId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the transaction' });
  }
};
const refund = async (req, res) => {
  const { transactionId, itemId } = req.body;

  try {
    await sequelize.transaction(async (t) => {
      const transaction = await Transaction.findByPk(transactionId, { transaction: t });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (itemId) {
        const orderItem = await OrderItem.findOne({
          where: { orderId: transaction.order_id, Item_id: itemId },
          transaction: t,
        });

        if (!orderItem) {
          return res.status(404).json({ error: 'Item not found in the transaction' });
        }

        const item = await Item.findByPk(itemId, { transaction: t });

        if (!item) {
          return res.status(404).json({ error: 'Item not found' });
        }

        // Refund the item
        const refundedAmount = orderItem.Count * item.price;
        const user = await User.findByPk(transaction.user_id, { transaction: t });
        user.Amount += refundedAmount;
        await user.save({ transaction: t });

        // Update item quantity
        item.quantity += orderItem.Count;
        await item.save({ transaction: t });

        // Remove the order item
        // await orderItem.destroy({ transaction: t });

        return res.status(200).json({ message: 'Item refunded successfully' });
      }
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing refund' });
  }
};


const refundWithQuantity = async (req, res) => {
  const { transactionId, itemId } = req.body;

  try {
    await sequelize.transaction(async (t) => {
      const transaction = await Transaction.findByPk(transactionId, { transaction: t });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (itemId) {
        const orderItem = await OrderItem.findOne({
          where: { orderId: transaction.order_id, Item_id: itemId },
          transaction: t,
        });

        if (!orderItem) {
          return res.status(404).json({ error: 'Item not found in the transaction' });
        }

        const item = await Item.findByPk(itemId, { transaction: t });

        if (!item) {
          return res.status(404).json({ error: 'Item not found' });
        }

        // Refund the item
        const refundedAmount = orderItem.Count * item.price;
        const user = await User.findByPk(transaction.user_id, { transaction: t });
        user.Amount += refundedAmount;
        await user.save({ transaction: t });

        // Update item quantity
        item.quantity += orderItem.Count;
        await item.save({ transaction: t });

        // Remove the order item
        // await orderItem.destroy({ transaction: t });

        return res.status(200).json({ message: 'Item refunded successfully' });
      }

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing refund' });
  }
};
const refundWithoutQuantity = async (req, res) => {
  const { transactionId, itemId } = req.body;

  try {
    await sequelize.transaction(async (t) => {
      const transaction = await Transaction.findByPk(transactionId, { transaction: t });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (itemId) {
        const orderItem = await OrderItem.findOne({
          where: { orderId: transaction.order_id, Item_id: itemId },
          transaction: t,
        });

        if (!orderItem) {
          return res.status(404).json({ error: 'Item not found in the transaction' });
        }

        const item = await Item.findByPk(itemId, { transaction: t });

        if (!item) {
          return res.status(404).json({ error: 'Item not found' });
        }

        // Refund the item
        const refundedAmount = orderItem.Count * item.price;
        const user = await User.findByPk(transaction.user_id, { transaction: t });
        user.Amount += refundedAmount;
        await user.save({ transaction: t });

        
        // Remove the order item
        await orderItem.destroy({ transaction: t });

        return res.status(200).json({ message: 'Item refunded successfully' });
      }

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing refund' });
  }
};





const getOrderItemsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params; // Assuming you pass orderId as a parameter
    // console.log(orderId)
    // Find all order items with the specified orderId
    const orderItems = await OrderItem.findAll({
      where: { orderId:orderId },
    });

    // Check if any order items were found
    if (orderItems.length == 0) {
      return res.status(200).json({ message: 'No order items found for the specified order.' });
    }

    // Return the found order items
    res.status(200).json(orderItems);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Controller to fetch data by Item ID
async function fetchDataByItemId(req, res) {
  try {
    const itemId = req.params.itemId;

    const orders = await OrderItem.findAll({
      where: {
        Item_id: itemId,
      },
    });

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller to fetch data by date
async function fetchDataByDate(req, res) {
  try {
    const date = req.params.date;

    const orders = await OrderItem.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(date), new Date(date + ' 23:59:59')],
        },
      },
    });

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function fetchDataWithinDateSpan(req, res) {
  try {
    const { startDate, endDate } = req.query;

    const orders = await OrderItem.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// Controller to fetch data within a particular date span for a specific item
async function fetchDataByItemAndDateSpan(req, res) {
  try {
    const { itemId, startDate, endDate } = req.query;

    const orders = await OrderItem.findAll({
      where: {
        Item_id: itemId,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const Transactioncompletion = async (req, res) => {
  const transactionId = req.params.id;
  try {
    // Check if the transaction is already completed
    const existingTransaction = await Transaction.findOne({
      where: { id: transactionId, Is_completed: 1 },
    });

    if (existingTransaction) {
      return res.status(200).json({ completed: 'Transaction is already completed' });
    }

    // If not completed, update the transaction status to completed (Is_completed: 1)
    await Transaction.update(
      { Is_completed: 1 },
      { where: { id: transactionId } }
    );

    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating the transaction' });
  }
};
const getItemForBill = async (req, res) => {
  console.log("enter");
  try {
    const availableItem = await Item.findAll({where:{Quantity:{[Op.gt]:0}},
      attributes: ['id','name', 'price', 'quantity', 'Shop_id'],
    });

    const result = await Promise.all(availableItem.map(async (ele) => {
      console.log(ele);
      const shopname = (await Shop.findByPk(ele.Shop_id)).name;
      const data = { ...ele.dataValues, shopname };
      return data;
    }));

    res.send(JSON.stringify( result ));
  } catch (err) {
    res.send(JSON.stringify({ error: err.message }));
  }
};







module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  refund,
  createTransactionByAdmin,
  createTransactionByUser,
  checkQuantity,
  getAllTransactionsbyUser,
  getOrderItemsByOrderId,
  fetchDataByItemId,
  fetchDataByDate,
  fetchDataWithinDateSpan,
  fetchDataByItemAndDateSpan,
  getIncompleteTransactionsbyUser,
  createNaturalTransactionByAdmin,
  refundWithQuantity,
  refundWithoutQuantity,
  Transactioncompletion,
  getItemForBill
};
