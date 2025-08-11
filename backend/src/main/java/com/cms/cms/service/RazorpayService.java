package com.cms.cms.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import org.json.JSONObject;

@Service
public class RazorpayService {

    // create Razorpay order using caterer's credentials
    public Order createRazorpayOrder(String razorpayKey, String razorpaySecret, Long amountPaise,
            String receipt) throws Exception {
        RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountPaise); // amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receipt);
        orderRequest.put("payment_capture", 1); // auto-capture

        Order order = client.orders.create(orderRequest);
        return order;
    }

    // verify the signature: requires the same secret used to create the order
    public boolean verifySignature(Map<String, String> attributes, String secret) {
        try {
            // Convert Map to JSONObject
            JSONObject json = new JSONObject();
            json.put("razorpay_order_id", attributes.get("razorpay_order_id"));
            json.put("razorpay_payment_id", attributes.get("razorpay_payment_id"));
            json.put("razorpay_signature", attributes.get("razorpay_signature"));

            Utils.verifyPaymentSignature(json, secret);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

}
