import React, { useEffect } from 'react'
function Payment() {
  const makePaymentFun = async () => {
     await fetch("http://localhost:8000/create/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res)=>{
      if (!res.ok || res.status!=200){
        throw new Error("Something went wrong")
      }
      return res.json()
    })
    .then((order)=>{
      console.log("orders ", order)
      const options = {
        key: "RAZORPAY_KEY",
        order_id: order.msg.id, // If don't give order id , then It will take default - currency and amount 
        currency: order.msg.currency,
        amount: order.msg.amount,
        name: 'Blog',
        handler:  function (response) {
             fetch("http://localhost:8000/payment/verify",{
              method:"POST",
              headers:{
                "Content-Type":'application/json'
              },
              body:JSON.stringify(response)
            })
            .then((res)=>{
              if(!res.ok || res.status!=200){
                throw new Error("Payment Failed")
              }
              return res.json()
            }).then((data)=>{
              console.log("Payment Done",data)
            }).catch((e)=>{
              console.log("error : ",e)
            })
        }
      }
      const rzp = window.Razorpay(options);
      rzp.open()

    }).catch((e)=>{
      console.log(e.message || "something went wrong ")
    })
  }
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true; // optional hai 
    document.body.appendChild(script);
  }, []);
  return (
    <div>
      <button id="payBtn" onClick={() => makePaymentFun()}>Pay Now</button>
    </div>
  )
}

export default Payment
