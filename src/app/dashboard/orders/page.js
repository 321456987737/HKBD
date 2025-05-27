"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const itemsPerPage = 5;

  const fetchOrders = async (isLoadMore = false) => {
    try {
      isLoadMore ? setLoadingMore(true) : setLoading(true);
      const lastId = isLoadMore && orders.length > 0 ? orders[orders.length - 1]._id : null;
      const res = await axios.get(`/api/orders?limit=${itemsPerPage}${lastId ? `&lastId=${lastId}` : ""}`);
      const newOrders = res.data.orders;
      setHasMore(res.data.hasMore);
      isLoadMore ? setOrders((prev) => [...prev, ...newOrders]) : setOrders(newOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setOrders([]);
    setHasMore(true);
    fetchOrders();
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchOrders(true);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatPrice = (price) => {
    if (!price) return "Rs 0";
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    })
      .format(Number(price))
      .replace("PKR", "Rs");
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "destructive";
      case "PROCESSING":
      case "SHIPPED":
        return "outline";
      default:
        return "secondary";
    }
  };

 const updateOrderStatus = async (orderId, newStatus) => {
  try {
    setUpdatingStatusId(orderId);
    await axios.patch(`/api/orders`, {
      orderId,
      updates: { status: newStatus }
    });
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  } catch (error) {
    console.error("Failed to update status:", error);
  } finally {
    setUpdatingStatusId(null);
  }
};

  if (loading && !loadingMore && orders.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full bg-white px-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
        <div className="text-sm text-muted-foreground">
          Showing {orders.length} {orders.length === 1 ? "order" : "orders"}
          {hasMore && !loading && " (more available)"}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <OrderRow
                      key={order._id}
                      order={order}
                      expandedOrder={expandedOrder}
                      toggleOrderDetails={toggleOrderDetails}
                      formatPrice={formatPrice}
                      getStatusVariant={getStatusVariant}
                      updateOrderStatus={updateOrderStatus}
                      updatingStatusId={updatingStatusId}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center w-full items-center mt-4">
        <button
          onClick={handleRefresh}
          className="hover:bg-slate-100 p-2 rounded-full transition-all"
          disabled={loading}
        >
          <ArrowPathIcon className={`h-6 w-6 hover:cursor-pointer transition-all ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {hasMore && orders.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            className="w-40 gap-2"
          >
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  expandedOrder,
  toggleOrderDetails,
  formatPrice,
  getStatusVariant,
  updateOrderStatus,
  updatingStatusId,
}) {
  return (
    <>
      <TableRow key={order._id} className="hover:bg-muted/50">
        <TableCell className="font-medium">
          #{order._id.toString().slice(-6).toUpperCase()}
        </TableCell>
        <TableCell>
          {order.customer?.firstName} {order.customer?.lastName}
        </TableCell>
        <TableCell>
          <div className="text-sm">{order.customer?.email}</div>
          <div className="text-xs text-muted-foreground">{order.customer?.phone}</div>
        </TableCell>
        <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="capitalize px-2 py-1 h-auto text-xs">
                {updatingStatusId === order._id ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  order.status?.toLowerCase()
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {STATUS_OPTIONS.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => updateOrderStatus(order._id, status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
        <TableCell>
          {order.createdAt ? format(new Date(order.createdAt), "MMM dd, yyyy") : "N/A"}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleOrderDetails(order._id)}>
                {expandedOrder === order._id ? "Hide details" : "View details"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {expandedOrder === order._id && (
        <TableRow className="bg-muted/10">
          <TableCell colSpan={7}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Name</p><p>{order.customer?.firstName} {order.customer?.lastName}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p>{order.customer?.email}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p>{order.customer?.phone}</p></div>
                  <div><p className="text-muted-foreground">Address</p><p>{order.customer?.address || "Not provided"}</p></div>
                  <div><p className="text-muted-foreground">City</p><p>{order.customer?.city}</p></div>
                  <div><p className="text-muted-foreground">Postal Code</p><p>{order.customer?.postalCode}</p></div>
                  <div><p className="text-muted-foreground">Order ID</p><p>{order._id}</p></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Order Summary</h3>
                <div className="space-y-3">
                  {order.cartItems?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/20">
                      <div>
                        <p className="font-medium">{item.name || "Unknown Product"}</p>
                        <p className="text-muted-foreground text-xs">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                        {item.size && <p className="text-muted-foreground text-xs">Size: {item.size}</p>}
                        {item.color && <p className="text-muted-foreground text-xs">Color: {item.color}</p>}
                      </div>
                      <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-2 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal || order.total)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-destructive">-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    {order.shipping > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>+{formatPrice(order.shipping)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
