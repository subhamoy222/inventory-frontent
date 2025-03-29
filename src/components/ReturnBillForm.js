// // import React, { useState } from "react";
// // import * as XLSX from "xlsx";
// // import "./ReturnBillForm.css";

// // const ReturnBillForm = () => {
// //   const [items, setItems] = useState([
// //     {
// //       itemName: "",
// //       batch: "",
// //       batchOptions: [],
// //       availableQuantity: 0,
// //       returnQuantity: "",
// //       mrp: "",
// //       amount: "",
// //     },
// //   ]);

// //   const [returnDetails, setReturnDetails] = useState({
// //     returnInvoiceNumber: "",
// //     date: "",
// //     receiptNumber: "",
// //     customerName: "",
// //   });

// //   const [message, setMessage] = useState("");

// //   const handleItemChange = async (index, event) => {
// //     const { name, value } = event.target;
// //     const updatedItems = [...items];
// //     updatedItems[index][name] = value;

// //     if (name === "itemName" && value) {
// //       try {
// //         const response = await fetch(
// //           `http://localhost:5000/api/inventory/?itemName=${encodeURIComponent(value)}`
// //         );

// //         if (response.ok) {
// //           const data = await response.json();
// //           if (data.length > 0) {
// //             updatedItems[index].batchOptions = data.map((batch) => ({
// //               batchNumber: batch.batch,
// //               quantity: batch.quantity,
// //               mrp: batch.mrp,
// //             }));
// //             updatedItems[index].batch = data[0].batch;
// //             updatedItems[index].availableQuantity = data[0].quantity;
// //             updatedItems[index].mrp = data[0].mrp;
// //             setMessage("");
// //           } else {
// //             setMessage("No batch details available for this item.");
// //             updatedItems[index].batchOptions = [];
// //             updatedItems[index].batch = "";
// //             updatedItems[index].availableQuantity = 0;
// //             updatedItems[index].mrp = "";
// //           }
// //         } else {
// //           setMessage("Failed to fetch item details.");
// //         }
// //       } catch (error) {
// //         setMessage("Error occurred while fetching item details.");
// //       }
// //     }

// //     if (name === "batch") {
// //       const selectedBatch = updatedItems[index].batchOptions.find(
// //         (batch) => batch.batchNumber === value
// //       );
// //       if (selectedBatch) {
// //         updatedItems[index].availableQuantity = selectedBatch.quantity;
// //         updatedItems[index].mrp = selectedBatch.mrp;
// //       }
// //     }

// //     const returnQuantity = parseInt(updatedItems[index].returnQuantity || 0, 10);
// //     const mrp = parseFloat(updatedItems[index].mrp || 0);

// //     updatedItems[index].amount = (returnQuantity * mrp).toFixed(2);
// //     setItems(updatedItems);
// //   };

// //   const handleDetailsChange = (event) => {
// //     const { name, value } = event.target;
// //     setReturnDetails({ ...returnDetails, [name]: value });
// //   };

// //   const addItem = () => {
// //     setItems([
// //       ...items,
// //       {
// //         itemName: "",
// //         batch: "",
// //         batchOptions: [],
// //         availableQuantity: 0,
// //         returnQuantity: "",
// //         mrp: "",
// //         amount: "",
// //       },
// //     ]);
// //   };

// //   const exportToExcel = () => {
// //     const wb = XLSX.utils.book_new();
// //     const wsData = [
// //       [
// //         "Item Name",
// //         "Batch",
// //         "Available Quantity",
// //         "Return Quantity",
// //         "MRP",
// //         "Amount",
// //       ],
// //       ...items.map((item) => [
// //         item.itemName,
// //         item.batch,
// //         item.availableQuantity,
// //         item.returnQuantity,
// //         item.mrp,
// //         item.amount,
// //       ]),
// //     ];
// //     const ws = XLSX.utils.aoa_to_sheet(wsData);
// //     XLSX.utils.book_append_sheet(wb, ws, "Return Bill");
// //     XLSX.writeFile(wb, "ReturnBill.xlsx");
// //   };

// //   const createReturnBill = async () => {
// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       setMessage("User is not authenticated. Please log in again.");
// //       return;
// //     }

// //     const totalAmount = items.reduce(
// //       (sum, item) => sum + parseFloat(item.amount || 0),
// //       0
// //     );

// //     const body = {
// //       ...returnDetails,
// //       items: items.map(({ batchOptions, availableQuantity, ...rest }) => rest),
// //       totalAmount,
// //     };

// //     try {
// //       const response = await fetch("http://localhost:5000/api/bills/return", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(body),
// //       });

// //       if (response.ok) {
// //         setMessage("Return bill created successfully!");
// //         exportToExcel(); // Export to Excel after return bill creation
// //       } else {
// //         const errorData = await response.json();
// //         setMessage(
// //           `Failed to create return bill: ${errorData.message || "Unknown error"}`
// //         );
// //       }
// //     } catch (error) {
// //       setMessage("Error occurred while creating the return bill.");
// //     }
// //   };

// //   return (
// //     <div className="return-bill-form">
// //       <h2>Create Return Bill</h2>

// //       <div className="return-details">
// //         <input
// //           type="text"
// //           name="returnInvoiceNumber"
// //           placeholder="Return Invoice Number"
// //           value={returnDetails.returnInvoiceNumber}
// //           onChange={handleDetailsChange}
// //         />
// //         <input
// //           type="date"
// //           name="date"
// //           value={returnDetails.date}
// //           onChange={handleDetailsChange}
// //         />
// //         <input
// //           type="text"
// //           name="receiptNumber"
// //           placeholder="Receipt Number"
// //           value={returnDetails.receiptNumber}
// //           onChange={handleDetailsChange}
// //         />
// //         <input
// //           type="text"
// //           name="customerName"
// //           placeholder="Customer Name"
// //           value={returnDetails.customerName}
// //           onChange={handleDetailsChange}
// //         />
// //       </div>

// //       <div className="table">
// //         <div className="table-header">
// //           {[
// //             "Item Name",
// //             "Batch",
// //             "Available Quantity",
// //             "Return Quantity",
// //             "MRP",
// //             "Amount",
// //           ].map((header, index) => (
// //             <div key={index}>{header}</div>
// //           ))}
// //         </div>

// //         {items.map((item, rowIndex) => (
// //           <div key={rowIndex} className="table-row">
// //             <input
// //               type="text"
// //               name="itemName"
// //               value={item.itemName}
// //               onChange={(e) => handleItemChange(rowIndex, e)}
// //               placeholder="Item Name"
// //             />
// //             <select
// //               name="batch"
// //               value={item.batch}
// //               onChange={(e) => handleItemChange(rowIndex, e)}
// //             >
// //               {item.batchOptions.map((batch) => (
// //                 <option key={batch.batchNumber} value={batch.batchNumber}>
// //                   {batch.batchNumber}
// //                 </option>
// //               ))}
// //             </select>
// //             <input
// //               type="text"
// //               name="availableQuantity"
// //               value={item.availableQuantity}
// //               readOnly
// //               placeholder="Available Quantity"
// //             />
// //             <input
// //               type="number"
// //               name="returnQuantity"
// //               value={item.returnQuantity}
// //               onChange={(e) => handleItemChange(rowIndex, e)}
// //               placeholder="Return Quantity"
// //             />
// //             <input
// //               type="number"
// //               name="mrp"
// //               value={item.mrp}
// //               readOnly
// //               placeholder="MRP"
// //             />
// //             <input
// //               type="text"
// //               name="amount"
// //               value={item.amount}
// //               readOnly
// //               placeholder="Amount"
// //             />
// //           </div>
// //         ))}
// //       </div>

// //       <button onClick={addItem}>Add Item</button>
// //       <button onClick={createReturnBill}>Create Return Bill</button>
// //       <button onClick={exportToExcel}>Export to Excel</button>

// //       {message && <p className="message">{message}</p>}
// //     </div>
// //   );
// // };

// // export default ReturnBillForm;



// // import React, { useState } from "react";
// // import axios from "axios";
// // import "./ReturnBillForm.css";

// // const ReturnBillForm = () => {
// //   const [items, setItems] = useState([
// //     {
// //       itemName: "",
// //       batch: "",
// //       availableQuantity: 0,
// //       returnQuantity: 0,
// //       amount: 0,
// //       discount: 0,
// //     },
// //   ]);

// //   const [returnDetails, setReturnDetails] = useState({
// //     returnInvoiceNumber: "",
// //     originalBillNumber: "",
// //     date: "",
// //     receiptNumber: "",
// //     customerName: "",
// //   });

// //   const [message, setMessage] = useState("");

// //   const handleItemChange = async (index, event) => {
// //     const { name, value } = event.target;
// //     const updatedItems = [...items];
// //     updatedItems[index][name] = value;

// //     if (name === "itemName" && value) {
// //       try {
// //         const response = await fetch(
// //           `http://localhost:5000/api/inventory/?itemName=${encodeURIComponent(value)}`
// //         );
// //         if (response.ok) {
// //           const data = await response.json();
// //           if (data.length > 0) {
// //             updatedItems[index].availableQuantity = data[0].quantity;
// //           } else {
// //             setMessage(`No inventory data found for ${value}`);
// //           }
// //         } else {
// //           setMessage("Error fetching inventory data");
// //         }
// //       } catch (error) {
// //         setMessage("Error occurred while fetching item details.");
// //       }
// //     }

// //     // Calculate item amount
// //     const returnQuantity = parseInt(updatedItems[index].returnQuantity || 0, 10);
// //     const itemPrice = parseFloat(updatedItems[index].price || 0);
// //     updatedItems[index].amount = (returnQuantity * itemPrice).toFixed(2);

// //     setItems(updatedItems);
// //   };

// //   const handleDetailsChange = (event) => {
// //     const { name, value } = event.target;
// //     setReturnDetails({ ...returnDetails, [name]: value });
// //   };

// //   const addItem = () => {
// //     setItems([
// //       ...items,
// //       {
// //         itemName: "",
// //         batch: "",
// //         availableQuantity: 0,
// //         returnQuantity: 0,
// //         amount: 0,
// //         discount: 0,
// //       },
// //     ]);
// //   };

// //   const createReturnBill = async () => {
// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       setMessage("User is not authenticated. Please log in again.");
// //       return;
// //     }

// //     const body = {
// //       ...returnDetails,
// //       items: items.map(({ availableQuantity, ...rest }) => rest),
// //     };

// //     try {
// //       const response = await axios.post(
// //         "http://localhost:5000/api/bills/return",
// //         body,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       if (response.status === 201) {
// //         setMessage("Return bill created successfully!");
// //       } else {
// //         setMessage(`Failed to create return bill: ${response.data.message}`);
// //       }
// //     } catch (error) {
// //       setMessage("Error occurred while creating the return bill.");
// //     }
// //   };

// //   return (
// //     <div className="return-bill-form">
// //       <h2>Create Return Bill</h2>

// //       <div className="return-details">
// //         <input
// //           type="text"
// //           name="returnInvoiceNumber"
// //           placeholder="Return Invoice Number"
// //           value={returnDetails.returnInvoiceNumber}
// //           onChange={handleDetailsChange}
// //         />
// //         <input
// //           type="text"
// //           name="originalBillNumber"
// //           placeholder="Original Bill Number"
// //           value={returnDetails.originalBillNumber}
// //           onChange={handleDetailsChange}
// //         />
// //         <input
// //           type="date"
// //           name="date"
// //           value={returnDetails.date}
// //           onChange={handleDetailsChange}
// //         />
// //         <input
// //           type="text"
// //           name="receiptNumber"
// //           placeholder="Receipt Number"
// //           value={returnDetails.receiptNumber}
// //           onChange={handleDetailsChange}
// //         />
// //         <input
// //           type="text"
// //           name="customerName"
// //           placeholder="Customer Name"
// //           value={returnDetails.customerName}
// //           onChange={handleDetailsChange}
// //         />
// //       </div>

// //       <div className="table">
// //         <div className="table-header">
// //           {["Item Name", "Batch", "Available Quantity", "Return Quantity", "Amount", "Discount"].map((header, index) => (
// //             <div key={index}>{header}</div>
// //           ))}
// //         </div>

// //         {items.map((item, rowIndex) => (
// //           <div key={rowIndex} className="table-row">
// //             <input
// //               type="text"
// //               name="itemName"
// //               value={item.itemName}
// //               onChange={(e) => handleItemChange(rowIndex, e)}
// //               placeholder="Item Name"
// //             />
// //             <input
// //               type="text"
// //               name="batch"
// //               value={item.batch}
// //               onChange={(e) => handleItemChange(rowIndex, e)}
// //               placeholder="Batch"
// //             />
// //             <input
// //               type="text"
// //               name="availableQuantity"
// //               value={item.availableQuantity}
// //               readOnly
// //               placeholder="Available Quantity"
// //             />
// //             <input
// //               type="number"
// //               name="returnQuantity"
// //               value={item.returnQuantity}
// //               onChange={(e) => handleItemChange(rowIndex, e)}
// //               placeholder="Return Quantity"
// //             />
// //             <input
// //               type="text"
// //               name="amount"
// //               value={item.amount}
// //               readOnly
// //               placeholder="Amount"
// //             />
// //             <input
// //               type="number"
// //               name="discount"
// //               value={item.discount}
// //               onChange={(e) => handleItemChange(rowIndex, e)}
// //               placeholder="Discount %"
// //             />
// //           </div>
// //         ))}
// //       </div>

// //       <button onClick={addItem}>Add Item</button>
// //       <button onClick={createReturnBill}>Create Return Bill</button>

// //       {message && <p className="message">{message}</p>}
// //     </div>
// //   );
// // };

// // export default ReturnBillForm;

// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import "./ReturnBillFor.css";

// // const ReturnBillForm = () => {
// //   const [customerName, setCustomerName] = useState('');
// //   const [items, setItems] = useState([{ batch: '', itemName: '', quantity: 0 }]);
// //   const [returnInvoiceNumber, setReturnInvoiceNumber] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(null);

// //   const handleAddItem = () => {
// //     setItems([...items, { batch: '', itemName: '', quantity: 0 }]);
// //   };

// //   const handleItemChange = (index, event) => {
// //     const newItems = [...items];
// //     newItems[index][event.target.name] = event.target.value;
// //     setItems(newItems);
// //   };

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     setLoading(true);
// //     setError(null);
// //     setSuccess(null);

// //     try {
// //       const response = await axios.post(
// //         'http://localhost:5000/api/bills/return', // Adjust this URL according to your backend
// //         {
// //           customerName,
// //           items,
// //           returnInvoiceNumber,
// //         }
// //       );
// //       setSuccess(response.data.message);
// //       setLoading(false);
// //     } catch (error) {
// //       setError('Error creating return bill');
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Create Return Bill</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div>
// //           <label>Customer Name</label>
// //           <input
// //             type="text"
// //             value={customerName}
// //             onChange={(e) => setCustomerName(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div>
// //           <label>Return Invoice Number</label>
// //           <input
// //             type="text"
// //             value={returnInvoiceNumber}
// //             onChange={(e) => setReturnInvoiceNumber(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div>
// //           <h3>Items</h3>
// //           {items.map((item, index) => (
// //             <div key={index} className="item-row">
// //               <div>
// //                 <label>Batch</label>
// //                 <input
// //                   type="text"
// //                   name="batch"
// //                   value={item.batch}
// //                   onChange={(e) => handleItemChange(index, e)}
// //                   required
// //                 />
// //               </div>
// //               <div>
// //                 <label>Item Name</label>
// //                 <input
// //                   type="text"
// //                   name="itemName"
// //                   value={item.itemName}
// //                   onChange={(e) => handleItemChange(index, e)}
// //                   required
// //                 />
// //               </div>
// //               <div>
// //                 <label>Quantity</label>
// //                 <input
// //                   type="number"
// //                   name="quantity"
// //                   value={item.quantity}
// //                   onChange={(e) => handleItemChange(index, e)}
// //                   required
// //                 />
// //               </div>
// //             </div>
// //           ))}
// //           <button type="button" onClick={handleAddItem}>Add Item</button>
// //         </div>
// //         <button type="submit" disabled={loading}>
// //           {loading ? 'Creating Return Bill...' : 'Create Return Bill'}
// //         </button>
// //       </form>

// //       {error && <p style={{ color: 'red' }}>{error}</p>}
// //       {success && <p style={{ color: 'green' }}>{success}</p>}
// //     </div>
// //   );
// // };

// // export default ReturnBillForm;


// // ReturnBill.js - React Component
// import React, { useState } from 'react';
// import axios from 'axios';

// const ReturnBill = () => {
//   const [customerName, setCustomerName] = useState('');
//   const [productName, setProductName] = useState('');
//   //const [batches, setBatches] = useState([]);
//   const [returnQuantity, setReturnQuantity] = useState(0);
//   const [availableQuantity, setAvailableQuantity] = useState(0);
//   const [message, setMessage] = useState('');

//   // Fetch batches when product name changes
//   // const fetchBatches = async () => {
//   //   try {
//   //     const response = await axios.post('/api/getBatches', {
//   //       customerName,
//   //       productName,
//   //     });
//   //     const fetchedBatches = response.data;
//   //     const totalQuantity = fetchedBatches.reduce(
//   //       (sum, batch) => sum + batch.quantity,
//   //       0
//   //     );
//   //     setBatches(fetchedBatches);
//   //     setAvailableQuantity(totalQuantity);
//   //   } catch (error) {
//   //     setMessage('Error fetching batches');
//   //   }
//   // };

//   // Handle return submission
//   const handleReturn = async () => {
//     if (returnQuantity <= 0 || returnQuantity > availableQuantity) {
//       setMessage(
//         'Invalid return quantity. Ensure it is within available stock.'
//       );
//       return;
//     }

//     try {
//       const response = await axios.post('/api/createReturnBill', {
//         customerName,
//         productName,
//         returnQuantity,
//       });
//       setMessage(response.data.message || 'Return bill created successfully');
//       setBatches([]);
//       setAvailableQuantity(0);
//       setReturnQuantity(0);
//     } catch (error) {
//       setMessage('Error creating return bill');
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Create Return Bill</h2>
//       <div className="mb-4">
//         <label className="block font-bold">Customer Name</label>
//         <input
//           type="text"
//           value={customerName}
//           onChange={(e) => setCustomerName(e.target.value)}
//           className="border p-2 w-full"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block font-bold">Product Name</label>
//         <input
//           type="text"
//           value={productName}
//           onChange={(e) => setProductName(e.target.value)}
//           className="border p-2 w-full"
//           onBlur={fetchBatches}
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block font-bold">Available Quantity: {availableQuantity}</label>
//       </div>

//       <div className="mb-4">
//         <label className="block font-bold">Return Quantity</label>
//         <input
//           type="number"
//           value={returnQuantity}
//           onChange={(e) => setReturnQuantity(Number(e.target.value))}
//           className="border p-2 w-full"
//         />
//       </div>

//       <button
//         onClick={handleReturn}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Create Return Bill
//       </button>

//       {message && <p className="mt-4 text-red-600">{message}</p>}
//     </div>
//   );
// };

// export default ReturnBill;





