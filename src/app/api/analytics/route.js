import { NextResponse } from "next/server";
import clientPromise from "@/lib/dbConnect";

export async function GET(req) {
  const client = await clientPromise;
  const orderDb = client.db("OrderDB");
  const orders = orderDb.collection("orders");

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const allorders = await orders.countDocuments({});

  const startOfThisMonth = new Date(thisYear, thisMonth, 1);
  const endOfThisMonth = new Date(thisYear, thisMonth + 1, 0, 23, 59, 59);

  const startOfLastMonth = new Date(thisYear, thisMonth - 1, 1);
  const endOfLastMonth = new Date(thisYear, thisMonth, 0, 23, 59, 59);

  const startOfTwoMonthsAgo = new Date(thisYear, thisMonth - 2, 1);
  const endOfTwoMonthsAgo = new Date(thisYear, thisMonth - 1, 0, 23, 59, 59);

  const ordersThisMonth = await orders.countDocuments({
    createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
  });

  const ordersLastMonth = await orders.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });

  const ordersTwoMonthsAgo = await orders.countDocuments({
    createdAt: { $gte: startOfTwoMonthsAgo, $lte: endOfTwoMonthsAgo },
  });

  // Users collection - adjust your DB name accordingly
  const userDB = client.db("your_db_name");
  const users = userDB.collection("users");

  const totalUsers = await users.countDocuments({});

  const thisMonthUsers = await users.countDocuments({
    createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
  });
  const lastMonthUsers = await users.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });
  const twoMonthsAgoUsers = await users.countDocuments({
    createdAt: { $gte: startOfTwoMonthsAgo, $lte: endOfTwoMonthsAgo },
  });

  // Total revenue and completed orders
  const result = await orders
    .aggregate([
      {
        $match: {
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          completedOrders: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const totalRevenue = result[0]?.totalRevenue || 0;
  const completedOrderCount = result[0]?.completedOrders || 0;

  // Revenue this month
  const thismonthrevenueResult = await orders
    .aggregate([
      {
        $match: {
          status: "COMPLETED",
          createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ])
    .toArray();

  const thismonthrevenue = thismonthrevenueResult[0]?.totalRevenue || 0;

  // Monthly stats for last 12 months
  const twelveMonthsData = await orders
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(thisYear - 1, thisMonth + 1, 1),
            $lte: endOfThisMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, "$total", 0],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ])
    .toArray();

  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(thisYear, thisMonth - 11 + i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const found = twelveMonthsData.find(
      (d) => d._id.year === year && d._id.month === month
    );

    return {
      month: `${year}-${month.toString().padStart(2, "0")}`,
      orders: found?.totalOrders || 0,
      revenue: found?.totalRevenue || 0,
    };
  });

  // --- New: Calculate category percentages for Pie Chart ---

  // Fetch all orders with cartItems
  const allOrdersFull = await orders.find().toArray();

  const categoryCounts = {};
  let totalQuantity = 0;

  for (const order of allOrdersFull) {
    if (!order.cartItems || !Array.isArray(order.cartItems)) continue;

    for (const item of order.cartItems) {
      const category = item.category || "Unknown";
      const quantity = item.quantity || 1;

      categoryCounts[category] = (categoryCounts[category] || 0) + quantity;
      totalQuantity += quantity;
    }
  }

  // Convert counts to percentages for chart
  const categoryPercentages = Object.entries(categoryCounts).map(
    ([category, count]) => ({
      name: category,
      value: Number(((count / totalQuantity) * 100).toFixed(2)),
    })
  );


  const VisitDB = client.db("VisitDB"); // make sure to replace with your actual DB name
  const visits = VisitDB.collection("visits");
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Aggregate user activity by hour in the last 24 hours
  const customerActivityRaw = await visits
    .aggregate([
      {
        $match: {
          createdAt: { $gte: twentyFourHoursAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            hour: { $hour: "$createdAt" },
          },
          count: { $sum: 1 }, // count visits or user signups in that hour
        },
      },
      {
        $sort: { "_id.hour": 1 },
      },
    ])
    .toArray();
    console.log("Customer Activity Raw Data:", customerActivityRaw);

  // Build an array with all 24 hours filled, even if count = 0
  const customerActivity = [];
  for (let i = 0; i < 24; i++) {
    const found = customerActivityRaw.find((r) => r._id.hour === i);
    customerActivity.push({
      hour: `${i.toString().padStart(2, "0")}:00`,
      active: found ? found.count : 0,
    });
  }
  console.log("Customer Activity Processed Data:", customerActivity);


  return NextResponse.json({
    thismonthrevenue,
    totalorders: allorders,
    ordersThisMonth,
    ordersLastMonth,
    ordersTwoMonthsAgo,
    totalUsers,
    thisMonthUsers,
    lastMonthUsers,
    twoMonthsAgoUsers,
    totalRevenue,
    completedOrderCount,
    monthlyStats,
    categoryPercentages, // This is ready for your PieChart component
     customerActivity,
  });
}

// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/dbConnect";

// export async function GET(req) {
//   const client = await clientPromise;
//   const orderDb = client.db("OrderDB");
//   const orders = orderDb.collection("orders");

//   const now = new Date();
//   const thisMonth = now.getMonth();
//   const thisYear = now.getFullYear();

//   const allorders = await orders.countDocuments({});

//   const startOfThisMonth = new Date(thisYear, thisMonth, 1);
//   const endOfThisMonth = new Date(thisYear, thisMonth + 1, 0, 23, 59, 59);

//   const startOfLastMonth = new Date(thisYear, thisMonth - 1, 1);
//   const endOfLastMonth = new Date(thisYear, thisMonth, 0, 23, 59, 59);

//   const startOfTwoMonthsAgo = new Date(thisYear, thisMonth - 2, 1);
//   const endOfTwoMonthsAgo = new Date(thisYear, thisMonth - 1, 0, 23, 59, 59);

//   const ordersThisMonth = await orders.countDocuments({
//     createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
//   });

//   const ordersLastMonth = await orders.countDocuments({
//     createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
//   });

//   const ordersTwoMonthsAgo = await orders.countDocuments({
//     createdAt: { $gte: startOfTwoMonthsAgo, $lte: endOfTwoMonthsAgo },
//   });

//   const userDB = client.db("your_db_name");
//   const users = userDB.collection("users");

//   const totalUsers = await users.countDocuments({});

//   const thisMonthUsers = await users.countDocuments({
//     createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
//   });
//   const lastMonthUsers = await users.countDocuments({
//     createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
//   });
//   const twoMonthsAgoUsers = await users.countDocuments({
//     createdAt: { $gte: startOfTwoMonthsAgo, $lte: endOfTwoMonthsAgo },
//   });

//   const result = await orders
//     .aggregate([
//       {
//         $match: {
//           status: "COMPLETED",
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$total" },
//           completedOrders: { $sum: 1 },
//         },
//       },
//     ])
//     .toArray();

//   const totalRevenue = result[0]?.totalRevenue || 0;
//   const completedOrderCount = result[0]?.completedOrders || 0;

//   const thismonthrevenueResult = await orders
//     .aggregate([
//       {
//         $match: {
//           status: "COMPLETED",
//           createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$total" },
//         },
//       },
//     ])
//     .toArray();

//   const thismonthrevenue = thismonthrevenueResult[0]?.totalRevenue || 0;

//   const twelveMonthsData = await orders
//     .aggregate([
//       {
//         $match: {
//           createdAt: {
//             $gte: new Date(thisYear - 1, thisMonth + 1, 1),
//             $lte: endOfThisMonth,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//           },
//           totalOrders: { $sum: 1 },
//           totalRevenue: {
//             $sum: {
//               $cond: [{ $eq: ["$status", "COMPLETED"] }, "$total", 0],
//             },
//           },
//         },
//       },
//       {
//         $sort: {
//           "_id.year": 1,
//           "_id.month": 1,
//         },
//       },
//     ])
//     .toArray();

//   const monthlyStats = Array.from({ length: 12 }, (_, i) => {
//     const date = new Date(thisYear, thisMonth - 11 + i, 1);
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;

//     const found = twelveMonthsData.find(
//       (d) => d._id.year === year && d._id.month === month
//     );

//     return {
//       month: `${year}-${month.toString().padStart(2, "0")}`,
//       orders: found?.totalOrders || 0,
//       revenue: found?.totalRevenue || 0,
//     };
//   });



//   return NextResponse.json({
//     thismonthrevenue,
//     totalorders: allorders,
//     ordersThisMonth,
//     ordersLastMonth,
//     ordersTwoMonthsAgo,
//     totalUsers,
//     thisMonthUsers,
//     lastMonthUsers,
//     twoMonthsAgoUsers,
//     totalRevenue,
//     completedOrderCount,
//     monthlyStats,
//   });
// }