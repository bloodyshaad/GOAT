import React, { useState } from 'react';
import { CreditCard, Truck, Shield, ArrowLeft } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onComplete: () => void;
}

export function Checkout({ items, total, onBack, onComplete }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Process payment
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const subtotal = total;
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= i ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {i}
                  </div>
                  {i < 3 && <div className={`w-12 h-0.5 mx-2 ${step > i ? 'bg-black' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold">
              {step === 1 && 'Shipping Information'}
              {step === 2 && 'Payment Details'}
              {step === 3 && 'Review Order'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Shipping Information</h3>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                  <p>{formData.email}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Payment Method</h3>
                  <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                  <p>{formData.nameOnCard}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
            >
              {step === 1 && 'Continue to Payment'}
              {step === 2 && 'Review Order'}
              {step === 3 && 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-8 rounded-2xl h-fit">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.selectedSize && `Size: ${item.selectedSize}`}
                    {item.selectedColor && item.selectedSize && ' • '}
                    {item.selectedColor && 'Color selected'}
                  </p>
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}