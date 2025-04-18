
// import React, { useState } from "react";
// import jsPDF from "jspdf";
// import "./SellBillForm.css";

// const SellBillForm = () => {
//   const [items, setItems] = useState([
//     {
//       itemName: "",
//       batch: "",
//       batchOptions: [],
//       availableQuantity: 0,
//       quantity: "",
//       mrp: "",
//       discount: "",
//       amount: "",
//     },
//   ]);

//   const [sellDetails, setSellDetails] = useState({
//     saleInvoiceNumber: "", // User will provide this now
//     date: new Date().toISOString().split("T")[0], // Default to current date
//     receiptNumber: "",
//     customerName: "",
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleItemChange = async (index, event) => {
//     const { name, value } = event.target;

//     setItems((prevItems) => {
//       const updatedItems = [...prevItems];
//       const currentItem = { ...updatedItems[index], [name]: value };

//       if (name === "itemName" && value) {
//         fetch(
//           `http://localhost:5000/api/inventory/?itemName=${encodeURIComponent(value)}`
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             if (data.length > 0) {
//               currentItem.batchOptions = data.map((batch) => ({
//                 batchNumber: batch.batch,
//                 quantity: batch.quantity,
//                 mrp: batch.mrp,
//               }));
//               currentItem.batch = data[0].batch;
//               currentItem.availableQuantity = data[0].quantity;
//               currentItem.mrp = data[0].mrp;
//             } else {
//               setMessage("No batch details available for this item.");
//               currentItem.batchOptions = [];
//               currentItem.batch = "";
//               currentItem.availableQuantity = 0;
//               currentItem.mrp = "";
//             }
//             updatedItems[index] = currentItem;
//             setItems(updatedItems);
//           })
//           .catch(() => setMessage("Error occurred while fetching item details."));
//         return updatedItems;
//       }

//       if (name === "batch") {
//         const selectedBatch = currentItem.batchOptions.find(
//           (batch) => batch.batchNumber === value
//         );
//         if (selectedBatch) {
//           currentItem.availableQuantity = selectedBatch.quantity;
//           currentItem.mrp = selectedBatch.mrp;
//         }
//       }

//       // Validate quantity and calculate amount
//       const quantity = parseInt(currentItem.quantity || 0, 10);
//       const mrp = parseFloat(currentItem.mrp || 0);
//       const discount = parseFloat(currentItem.discount || 0);

//       if (quantity > currentItem.availableQuantity) {
//         setMessage(
//           `Requested quantity exceeds available stock for ${currentItem.itemName}.`
//         );
//       } else {
//         currentItem.amount = ((quantity * mrp) - discount).toFixed(2);
//         setMessage("");
//       }

//       updatedItems[index] = currentItem;
//       return updatedItems;
//     });
//   };

//   const handleDetailsChange = (event) => {
//     const { name, value } = event.target;
//     setSellDetails({ ...sellDetails, [name]: value });
//   };

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         itemName: "",
//         batch: "",
//         batchOptions: [],
//         availableQuantity: 0,
//         quantity: "",
//         mrp: "",
//         discount: "",
//         amount: "",
//       },
//     ]);
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF({ orientation: "landscape" });
//     doc.text("Sell Bill", 14, 10);

//     const headers = [
//       "Item Name",
//       "Batch",
//       "Available Quantity",
//       "Requested Quantity",
//       "MRP",
//       "Discount",
//       "Amount",
//     ];

//     let y = 30;
//     headers.forEach((header, index) => {
//       doc.text(header, 10 + index * 25, y);
//     });

//     items.forEach((item) => {
//       y += 10;
//       [
//         item.itemName,
//         item.batch,
//         item.availableQuantity,
//         item.quantity,
//         item.mrp,
//         item.discount,
//         item.amount,
//       ].forEach((value, colIndex) => {
//         doc.text(value.toString() || "-", 10 + colIndex * 25, y);
//       });
//     });

//     doc.save("SellBill.pdf");
//   };

//   const createSellBill = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setMessage("User is not authenticated. Please log in again.");
//       return;
//     }

//     if (!sellDetails.customerName || !sellDetails.receiptNumber || !sellDetails.date) {
//       setMessage("Please fill in all the details before submitting.");
//       return;
//     }

//     const totalAmount = items.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );

//     const body = {
//       ...sellDetails,
//       items: items.map(({ batchOptions, availableQuantity, ...rest }) => rest),
//       totalAmount,
//     };

//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5000/api/bills/sale", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(body),
//       });
//       console.log(response);
//       if (response.status===201) {
//         // const responseData = await response.json();
//         console.log(response)
//         // if (response) {
          
//           setMessage(response.message || "Sale bill created and inventory updated successfully!");
//           generatePDF();
//         // } else {
//         //   setMessage(
//         //     `Failed to create sell bill: ${responseDa.message || "Unknown error"}`
//         //   );
//         // }
//       } else {

//         // const errorData = await response.json();
//         setMessage(
//           `Failed to create sell bill: ${response.message||"Unknown Error"}`
//         );
//       }
//     } catch (error) {
//       setMessage("Error occurred while creating the sell bill.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="sell-bill-form">
//       <h2>Create Sell Bill</h2>

//       <div className="sell-details">
//         <input
//           type="text"
//           name="saleInvoiceNumber"
//           placeholder="Sale Invoice Number"
//           value={sellDetails.saleInvoiceNumber}
//           onChange={handleDetailsChange}
//         />
//         <input
//           type="date"
//           name="date"
//           value={sellDetails.date}
//           onChange={handleDetailsChange}
//         />
//         <input
//           type="text"
//           name="receiptNumber"
//           placeholder="Receipt Number"
//           value={sellDetails.receiptNumber}
//           onChange={handleDetailsChange}
//         />
//         <input
//           type="text"
//           name="customerName"
//           placeholder="Customer Name"
//           value={sellDetails.customerName}
//           onChange={handleDetailsChange}
//         />
//       </div>

//       <div className="table">
//         <div className="table-header">
//           {[
//             "Item Name",
//             "Batch",
//             "Available Quantity",
//             "Requested Quantity",
//             "MRP",
//             "Discount",
//             "Amount",
//           ].map((header, index) => (
//             <div key={index}>{header}</div>
//           ))}
//         </div>

//         {items.map((item, rowIndex) => (
//           <div key={rowIndex} className="table-row">
//             <input
//               type="text"
//               name="itemName"
//               value={item.itemName}
//               onChange={(e) => handleItemChange(rowIndex, e)}
//               placeholder="Item Name"
//             />
//             <select
//               name="batch"
//               value={item.batch}
//               onChange={(e) => handleItemChange(rowIndex, e)}
//             >
//               {item.batchOptions.map((batch) => (
//                 <option key={batch.batchNumber} value={batch.batchNumber}>
//                   {batch.batchNumber}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="text"
//               name="availableQuantity"
//               value={item.availableQuantity}
//               readOnly
//               placeholder="Available Quantity"
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(rowIndex, e)}
//               placeholder="Quantity"
//             />
//             <input
//               type="number"
//               name="mrp"
//               value={item.mrp}
//               readOnly
//               placeholder="MRP"
//             />
//             <input
//               type="number"
//               name="discount"
//               value={item.discount}
//               onChange={(e) => handleItemChange(rowIndex, e)}
//               placeholder="Discount"
//             />
//             <input
//               type="text"
//               name="amount"
//               value={item.amount}
//               readOnly
//               placeholder="Amount"
//             />
//           </div>
//         ))}
//       </div>

//       <button onClick={addItem}>Add Item</button>
//       <button onClick={createSellBill} disabled={loading}>
//         {loading ? "Creating..." : "Create Sell Bill"}
//       </button>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default SellBillForm;


// import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";

// const SellBillForm = () => {
//   const [items, setItems] = useState([
//     {
//       itemName: "",
//       batch: "",
//       batchOptions: [],
//       availableQuantity: 0,
//       quantity: "",
//       mrp: "",
//       discount: "",
//       amount: "",
//       gstNo: ""
//     },
//   ]);

//   const [sellDetails, setSellDetails] = useState({
//     saleInvoiceNumber: "",
//     date: new Date().toISOString().split("T")[0],
//     receiptNumber: "",
//     partyName: "",
//     email: "",
//     gstNumber: "",
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setItems(prevItems => 
//       prevItems.map(item => ({
//         ...item,
//         gstNo: sellDetails.gstNumber
//       }))
//     );
//   }, [sellDetails.gstNumber]);

//   const handleItemChange = async (index, event) => {
//     const { name, value } = event.target;
//     const email = localStorage.getItem("email");

//     setItems((prevItems) => {
//       const updatedItems = [...prevItems];
//       const currentItem = { 
//         ...updatedItems[index], 
//         [name]: value,
//         gstNo: sellDetails.gstNumber
//       };

//       if (name === "itemName" && value && email) {
//         fetch(
//           `https://medicine-inventory-system.onrender.com/api/inventory?itemName=${encodeURIComponent(
//             value.toLowerCase()
//           )}&email=${encodeURIComponent(email)}`
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             if (data.length > 0) {
//               currentItem.batchOptions = data.map((batch) => ({
//                 batchNumber: batch.batch.replace(/[^a-zA-Z0-9]/g, ''),
//                 quantity: batch.quantity,
//                 mrp: batch.mrp,
//                 gstNo: sellDetails.gstNumber
//               }));
              
//               const sanitizedBatch = data[0].batch.replace(/[^a-zA-Z0-9]/g, '');
//               currentItem.batch = sanitizedBatch;
//               currentItem.availableQuantity = data[0].quantity;
//               currentItem.mrp = data[0].mrp?.toString() || "";
//               setMessage("");
//             } else {
//               setMessage(`No inventory found for ${value}`);
//               currentItem.batchOptions = [];
//               currentItem.batch = "";
//               currentItem.availableQuantity = 0;
//               currentItem.mrp = "";
//             }
//             updatedItems[index] = currentItem;
//             setItems(updatedItems);
//           })
//           .catch(() => setMessage("Error fetching inventory data"));
//         return updatedItems;
//       }

//       if (name === "batch") {
//         const cleanBatch = value.replace(/[^a-zA-Z0-9]/g, '');
//         const selectedBatch = currentItem.batchOptions.find(
//           (batch) => batch.batchNumber === cleanBatch
//         );
        
//         if (selectedBatch) {
//           currentItem.availableQuantity = selectedBatch.quantity;
//           currentItem.mrp = selectedBatch.mrp?.toString() || "";
//           currentItem.batch = cleanBatch;
//         }
//       }

//       // Quantity validation and amount calculation
//       const quantity = parseFloat(currentItem.quantity) || 0;
//       const mrp = parseFloat(currentItem.mrp) || 0;
//       const discount = parseFloat(currentItem.discount) || 0;

//       if (quantity > currentItem.availableQuantity) {
//         setMessage(`Insufficient stock for ${currentItem.itemName}`);
//       } else if (quantity <= 0) {
//         setMessage("Quantity must be greater than 0");
//       } else {
//         const itemAmount = quantity * mrp;
//         const discountedAmount = itemAmount - (itemAmount * discount) / 100;
//         currentItem.amount = discountedAmount.toFixed(2);
//         setMessage("");
//       }

//       updatedItems[index] = currentItem;
//       return updatedItems;
//     });
//   };

//   const handleDetailsChange = (event) => {
//     const { name, value } = event.target;
//     setSellDetails({ ...sellDetails, [name]: value });
//   };

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         itemName: "",
//         batch: "",
//         batchOptions: [],
//         availableQuantity: 0,
//         quantity: "",
//         mrp: "",
//         discount: "",
//         amount: "",
//         gstNo: sellDetails.gstNumber
//       },
//     ]);
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text(`GSTIN: ${sellDetails.gstNumber}`, 10, 10);
//     doc.text(`Invoice Number: ${sellDetails.saleInvoiceNumber}`, 10, 20);
    
//     const headers = [
//       "Item Name",
//       "Batch",
//       "Qty",
//       "MRP",
//       "Discount%",
//       "Amount"
//     ];

//     let y = 40;
//     headers.forEach((header, i) => {
//       doc.text(header, 10 + i * 35, y);
//     });

//     items.forEach((item) => {
//       y += 10;
//       [
//         item.itemName,
//         item.batch,
//         item.quantity,
//         item.mrp,
//         item.discount,
//         item.amount
//       ].forEach((value, i) => {
//         doc.text(String(value || "-"), 10 + i * 35, y);
//       });
//     });

//     const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
//     doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 10, y + 20);
    
//     doc.save("invoice.pdf");
//   };

//   const createSellBill = async () => {
//     const token = localStorage.getItem("token");
//     const email = localStorage.getItem("email");

//     if (!sellDetails.gstNumber) {
//       setMessage("GST Number is required");
//       return;
//     }

//     const gstMismatch = items.some(item => item.gstNo !== sellDetails.gstNumber);
//     if (gstMismatch) {
//       setMessage("All items must have the same GST Number");
//       return;
//     }

//     const invalidQuantities = items.some(item => 
//       item.availableQuantity < Number(item.quantity) || 
//       Number(item.quantity) <= 0
//     );

//     if (invalidQuantities) {
//       setMessage("Invalid quantities detected");
//       return;
//     }

//     const body = {
//       ...sellDetails,
//       items: items.map(({ batchOptions, availableQuantity, ...rest }) => ({
//         ...rest,
//         quantity: Number(rest.quantity),
//         mrp: Number(rest.mrp),
//         discount: Number(rest.discount),
//         gstNo: rest.gstNo
//       })),
//       email
//     };

//     try {
//       setLoading(true);
//       const response = await fetch("https://medicine-inventory-system.onrender.com/api/bills/sale", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const responseData = await response.json();

//       if (response.ok) {
//         setMessage("Invoice created successfully!");
//         generatePDF();
//         setItems([{
//           itemName: "",
//           batch: "",
//           batchOptions: [],
//           availableQuantity: 0,
//           quantity: "",
//           mrp: "",
//           discount: "",
//           amount: "",
//           gstNo: ""
//         }]);
//         setSellDetails({
//           saleInvoiceNumber: "",
//           date: new Date().toISOString().split("T")[0],
//           receiptNumber: "",
//           partyName: "",
//           email: "",
//           gstNumber: ""
//         });
//       } else {
//         setMessage(responseData.message || "Failed to create invoice");
//       }
//     } catch (error) {
//       setMessage("Error creating invoice");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl font-bold text-indigo-600 mb-2">Create Sales Invoice</h2>
//           <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full"></div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//           <div className="space-y-4">
//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-700 mb-1">GST Number</label>
//               <input
//                 type="text"
//                 name="gstNumber"
//                 placeholder="Enter GST Number"
//                 className="rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 transition-colors"
//                 value={sellDetails.gstNumber}
//                 onChange={handleDetailsChange}
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-700 mb-1">Party Name</label>
//               <input
//                 type="text"
//                 name="partyName"
//                 placeholder="Enter Party Name"
//                 className="rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 transition-colors"
//                 value={sellDetails.partyName}
//                 onChange={handleDetailsChange}
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
//                 <input
//                   type="text"
//                   name="saleInvoiceNumber"
//                   placeholder="Invoice #"
//                   className="rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 transition-colors"
//                   value={sellDetails.saleInvoiceNumber}
//                   onChange={handleDetailsChange}
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input
//                   type="date"
//                   name="date"
//                   className="rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 transition-colors"
//                   value={sellDetails.date}
//                   onChange={handleDetailsChange}
//                 />
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
//               <input
//                 type="text"
//                 name="receiptNumber"
//                 placeholder="Receipt #"
//                 className="rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 transition-colors"
//                 value={sellDetails.receiptNumber}
//                 onChange={handleDetailsChange}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mb-8">
//           <h3 className="text-xl font-semibold text-indigo-600 mb-4">Item Details</h3>
//           <div className="rounded-xl border-2 border-indigo-50 overflow-hidden">
//             <table className="w-full">
//               <thead className="bg-indigo-600 text-white">
//                 <tr>
//                   {["Item Name", "Batch", "Available", "Qty", "MRP", "Discount%", "GST No", "Amount"].map((header, idx) => (
//                     <th 
//                       key={idx}
//                       className="px-4 py-3 text-left text-sm font-medium last:text-right"
//                     >
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-indigo-50">
//                 {items.map((item, index) => (
//                   <tr 
//                     key={index}
//                     className="hover:bg-indigo-50 transition-colors"
//                   >
//                     <td className="px-4 py-3">
//                       <input
//                         type="text"
//                         name="itemName"
//                         value={item.itemName}
//                         onChange={(e) => handleItemChange(index, e)}
//                         className="w-full rounded-md border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <select
//                         name="batch"
//                         value={item.batch}
//                         onChange={(e) => handleItemChange(index, e)}
//                         className="w-full rounded-md border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
//                       >
//                         <option value="">Select Batch</option>
//                         {item.batchOptions.map((batch, idx) => (
//                           <option key={idx} value={batch.batchNumber}>
//                             {batch.batchNumber.replace(/[^a-zA-Z0-9]/g, '')}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       {item.availableQuantity?.toString() ?? "-"}
//                     </td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="number"
//                         name="quantity"
//                         value={item.quantity}
//                         onChange={(e) => handleItemChange(index, e)}
//                         className="w-full rounded-md border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
//                         min="0"
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="number"
//                         name="mrp"
//                         value={item.mrp}
//                         disabled
//                         className="w-full rounded-md bg-indigo-50 border-indigo-100"
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="number"
//                         name="discount"
//                         value={item.discount}
//                         onChange={(e) => handleItemChange(index, e)}
//                         className="w-full rounded-md border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
//                         min="0"
//                         max="100"
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="text"
//                         name="gstNo"
//                         value={sellDetails.gstNumber}
//                         readOnly
//                         className="w-full rounded-md bg-indigo-50 border-indigo-100"
//                       />
//                     </td>
//                     <td className="px-4 py-3 text-right font-medium text-emerald-600">
//                       {item.amount || "-"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <button
//             onClick={addItem}
//             className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//             Add Item
//           </button>

//           <div className="space-x-4">
//             {message && (
//               <div className="inline-flex items-center bg-rose-100 text-rose-700 px-4 py-2 rounded-lg">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 {message}
//               </div>
//             )}
            
//             <button
//               onClick={createSellBill}
//               className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
//               disabled={loading}
//             >
//               {loading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//                   </svg>
//                   Processing...
//                 </span>
//               ) : (
//                 "Create Sales Invoice"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellBillForm;
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

// const SellMedicine = () => {
//   const [items, setItems] = useState([
//     { itemName: "", batch: "", quantity: "", mrp: "", discount: "", amount: "", availableQuantity: 0, batchOptions: [] },
//   ]);
//   const [sellDetails, setSellDetails] = useState({ saleInvoiceNumber: "", gstNumber: "" });
//   const [message, setMessage] = useState("");
//   const typingTimeoutRef = useRef(null);
//   const latestInputRef = useRef("");

//   const fetchInventory = async (index, itemName) => {
//     if (!itemName.trim() || itemName.length < 3) return; // Avoid unnecessary API calls

//     // Avoid fetching if the latest input has changed
//     if (latestInputRef.current !== itemName) return;

//     const email = localStorage.getItem("email");
//     try {
//       const response = await fetch(
//         `https://medicine-inventory-system.onrender.com/api/inventory?itemName=${encodeURIComponent(
//           itemName.toLowerCase()
//         )}&email=${encodeURIComponent(email)}`
//       );
//       const data = await response.json();

//       setItems((prevItems) => {
//         const updatedItems = [...prevItems];
//         updatedItems[index] = {
//           ...updatedItems[index],
//           batchOptions: data.map(batch => ({
//             batchNumber: batch.batch.replace(/[^a-zA-Z0-9]/g, ""),
//             quantity: batch.quantity,
//             mrp: batch.mrp,
//           })),
//           batch: data.length > 0 ? data[0].batch.replace(/[^a-zA-Z0-9]/g, "") : "",
//           availableQuantity: data.length > 0 ? data[0].quantity : 0,
//           mrp: data.length > 0 ? data[0].mrp?.toString() || "" : "",
//         };
//         return updatedItems;
//       });

//       setMessage(data.length === 0 ? `No inventory found for ${itemName}` : "");
//     } catch (error) {
//       setMessage("Error fetching inventory data");
//     }
//   };

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     latestInputRef.current = value;

//     setItems((prevItems) => {
//       const updatedItems = [...prevItems];
//       let currentItem = { ...updatedItems[index], [name]: value };

//       if (name === "itemName") {
//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => {
//           fetchInventory(index, value);
//         }, 300); // Debounce API call
//       }

//       if (name === "batch") {
//         const selectedBatch = currentItem.batchOptions.find(
//           (batch) => batch.batchNumber === value
//         );
//         if (selectedBatch) {
//           currentItem = {
//             ...currentItem,
//             availableQuantity: selectedBatch.quantity,
//             mrp: selectedBatch.mrp?.toString() || "",
//           };
//         }
//       }

//       const quantity = parseFloat(currentItem.quantity) || 0;
//       const mrp = parseFloat(currentItem.mrp) || 0;
//       const discount = parseFloat(currentItem.discount) || 0;

//       if (quantity > currentItem.availableQuantity) {
//         setMessage(`Insufficient stock for ${currentItem.itemName}`);
//       } else if (quantity <= 0) {
//         setMessage("Quantity must be greater than 0");
//       } else {
//         currentItem.amount = ((quantity * mrp) * (1 - discount / 100)).toFixed(2);
//         setMessage("");
//       }

//       updatedItems[index] = currentItem;
//       return updatedItems;
//     });
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text(`GSTIN: ${sellDetails.gstNumber}`, 10, 10);
//     doc.text(`Invoice Number: ${sellDetails.saleInvoiceNumber}`, 10, 20);

//     const tableColumn = ["Item Name", "Batch", "Qty", "MRP", "Discount%", "Amount"];
//     const tableRows = items.map((item) => [
//       item.itemName,
//       item.batch,
//       item.quantity,
//       item.mrp,
//       item.discount,
//       item.amount,
//     ]);

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 30,
//       theme: "striped",
//     });

//     const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
//     doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
    
//     doc.save("invoice.pdf");
//   };

//   return (
//     <div>
//       {message && <p style={{ color: "red" }}>{message}</p>}
//       {items.map((item, index) => (
//         <div key={index}>
//           <input type="text" name="itemName" value={item.itemName} onChange={(e) => handleItemChange(index, e)} placeholder="Item Name" />
//           <select name="batch" value={item.batch} onChange={(e) => handleItemChange(index, e)}>
//             {item.batchOptions.map((batch, i) => (
//               <option key={i} value={batch.batchNumber}>{batch.batchNumber}</option>
//             ))}
//           </select>
//           <input type="number" name="quantity" value={item.quantity} min="1" onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" />
//           <input type="text" name="mrp" value={item.mrp} disabled placeholder="MRP" />
//           <input type="number" name="discount" value={item.discount} min="0" onChange={(e) => handleItemChange(index, e)} placeholder="Discount %" />
//           <input type="text" name="amount" value={item.amount} disabled placeholder="Amount" />
//         </div>
//       ))}
//       <button onClick={generatePDF}>Generate PDF</button>
//     </div>
//   );
// };

// export default SellMedicine;
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useTransition,
  memo,
} from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ItemInputRow = memo(({ item, index, handleItemChange }) => (
  <div key={index}>
    <input
      type="text"
      name="itemName"
      value={item.itemName}
      onChange={(e) => handleItemChange(index, e)}
      placeholder="Item Name"
    />
    <select
      name="batch"
      value={item.batch}
      onChange={(e) => handleItemChange(index, e)}
    >
      {item.batchOptions.map((batch, i) => (
        <option key={i} value={batch.batchNumber}>
          {batch.batchNumber}
        </option>
      ))}
    </select>
    <input
      type="number"
      name="quantity"
      value={item.quantity}
      min="1"
      onChange={(e) => handleItemChange(index, e)}
      placeholder="Quantity"
    />
    <input type="text" name="mrp" value={item.mrp} disabled placeholder="MRP" />
    <input
      type="number"
      name="discount"
      value={item.discount}
      min="0"
      onChange={(e) => handleItemChange(index, e)}
      placeholder="Discount %"
    />
    <input
      type="text"
      name="amount"
      value={item.amount}
      disabled
      placeholder="Amount"
    />
  </div>
));

const SellMedicine = () => {
  const [items, setItems] = useState([
    {
      itemName: "",
      batch: "",
      quantity: "",
      mrp: "",
      discount: "",
      amount: "",
      availableQuantity: 0,
      batchOptions: [],
    },
  ]);
  const [sellDetails, setSellDetails] = useState({
    saleInvoiceNumber: "",
    gstNumber: "",
  });
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef(null);
  const latestInputRef = useRef("");
  const [isPending, startTransition] = useTransition();

  const fetchInventory = useCallback(async (index, itemName) => {
    if (!itemName.trim() || itemName.length < 3) return;
    if (latestInputRef.current !== itemName) return;

    const email = localStorage.getItem("email");
    try {
      const response = await fetch(
        `https://medicine-inventory-system.onrender.com/api/inventory?itemName=${encodeURIComponent(
          itemName.toLowerCase()
        )}&email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      startTransition(() => {
        setItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[index] = {
            ...updatedItems[index],
            batchOptions: data.map((batch) => ({
              batchNumber: batch.batch.replace(/[^a-zA-Z0-9]/g, ""),
              quantity: batch.quantity,
              mrp: batch.mrp,
            })),
            batch:
              data.length > 0
                ? data[0].batch.replace(/[^a-zA-Z0-9]/g, "")
                : "",
            availableQuantity: data.length > 0 ? data[0].quantity : 0,
            mrp: data.length > 0 ? data[0].mrp?.toString() || "" : "",
          };
          return updatedItems;
        });
        setMessage(data.length === 0 ? `No inventory found for ${itemName}` : "");
      });
    } catch (error) {
      setMessage("Error fetching inventory data");
    }
  }, []);

  const handleItemChange = useCallback((index, event) => {
    const { name, value } = event.target;
    latestInputRef.current = value;

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      let currentItem = { ...updatedItems[index], [name]: value };

      if (name === "itemName") {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          fetchInventory(index, value);
        }, 300);
      }

      if (name === "batch") {
        const selectedBatch = currentItem.batchOptions.find(
          (batch) => batch.batchNumber === value
        );
        if (selectedBatch) {
          currentItem = {
            ...currentItem,
            availableQuantity: selectedBatch.quantity,
            mrp: selectedBatch.mrp?.toString() || "",
          };
        }
      }

      const quantity = parseFloat(currentItem.quantity) || 0;
      const mrp = parseFloat(currentItem.mrp) || 0;
      const discount = parseFloat(currentItem.discount) || 0;

      if (quantity > currentItem.availableQuantity) {
        setMessage(`Insufficient stock for ${currentItem.itemName}`);
      } else if (quantity <= 0) {
        setMessage("Quantity must be greater than 0");
      } else {
        const amount = quantity * mrp * (1 - discount / 100);
        currentItem.amount = amount.toFixed(2);
        setMessage("");
      }

      updatedItems[index] = currentItem;
      return updatedItems;
    });
  }, [fetchInventory]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`GSTIN: ${sellDetails.gstNumber}`, 10, 10);
    doc.text(`Invoice Number: ${sellDetails.saleInvoiceNumber}`, 10, 20);

    const tableColumn = ["Item Name", "Batch", "Qty", "MRP", "Discount%", "Amount"];
    const tableRows = items.map((item) => [
      item.itemName,
      item.batch,
      item.quantity,
      item.mrp,
      item.discount,
      item.amount,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "striped",
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    doc.text(
      `Total Amount: ₹${totalAmount.toFixed(2)}`,
      10,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("invoice.pdf");
  };

  return (
    <div>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {items.map((item, index) => (
        <ItemInputRow
          key={index}
          item={item}
          index={index}
          handleItemChange={handleItemChange}
        />
      ))}
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default SellMedicine;

