import React from 'react';
import { CheckCircle, Download, Truck } from 'lucide-react';

interface OrderSuccessProps {
  orderNumber: string;
  onContinueShopping: () => void;
}

export function OrderSuccess({ orderNumber, onContinueShopping }: OrderSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-black mb-4">
        Order Confirmed!
      </h1>
      
      <p className="text-gray-600 mb-2">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      
      <p className="text-lg font-semibold text-black mb-8">
        Order #{orderNumber}
      </p>
      
      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        <h3 className="font-semibold mb-4">What happens next?</h3>
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <p className="font-medium">Order Processing</p>
              <p className="text-sm text-gray-600">We'll prepare your items for shipment within 1-2 business days.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <p className="font-medium">Shipping Confirmation</p>
              <p className="text-sm text-gray-600">You'll receive a tracking number via email once your order ships.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <p className="font-medium">Delivery</p>
              <p className="text-sm text-gray-600">Your order will arrive within 3-5 business days.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300">
          <Truck className="w-5 h-5" />
          Track Your Order
        </button>
        <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors duration-300">
          <Download className="w-5 h-5" />
          Download Receipt
        </button>
      </div>
      
      <button
        onClick={onContinueShopping}
        className="mt-8 text-black font-medium hover:underline"
      >
        Continue Shopping
      </button>
    </div>
  );
}