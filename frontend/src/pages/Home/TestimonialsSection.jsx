import React from "react";
import "../../Styles/Testimonial.css"; // Optional: add custom styles here

const testimonials = [
  {
    name: "Amit Deshmukh",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    feedback:
      "ServeEasy made ordering lunch from my college canteen super simple! I no longer worry about carrying change or missing out on meals — I just place my order and get a coupon instantly.",
    rating: 5,
  },
  {
    name: "Priya Jadhav",
    role: "Caterer - Client",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    feedback:
      "This platform helped me grow my food business within the campus. I can now manage menus, receive orders in real time, and ensure safe payments — no more cash troubles!",
    rating: 5,
  },
  {
    name: "Narendra Wagh",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/men/70.jpg",
    feedback:
      "Buying multiple coupons at once is so helpful! I don't have to repeat the same process daily. It's smooth, secure, and very student-friendly.",
    rating: 5,
  },
  {
    name: "Manisha Kulkarni",
    role: "Caterer - Client",
    avatar: "https://randomuser.me/api/portraits/women/72.jpg",
    feedback:
      "ServeEasy brought structure to my canteen business. Orders are organized, payments are timely, and customers are happier. It's a win-win!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-5 testimonial-card text-white">
      <div className="text-center mb-5">
        <h6 className="text-warning">🍴 Customer Feedback</h6>
        <h2>What Our Clients Say</h2>
      </div>

      <div className="container">
        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="testimonial-card bg-clr  rounded shadow p-4 h-100">
                <div className="quote-icon fs-1 text-warning mb-2">“</div>
                <p className="small">{testimonial.feedback}</p>
                <div className="quote-icon fs-1 text-warning text-end">”</div>

                <div className="text-center mt-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="rounded-circle mb-2"
                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  />
                  <h5 className="mb-0">{testimonial.name}</h5>
                  <small className="text-muted">{testimonial.role}</small>
                  <div className="mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span className="text-warning" key={i}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
