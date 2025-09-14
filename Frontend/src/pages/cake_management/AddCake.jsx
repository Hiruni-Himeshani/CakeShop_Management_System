import React, { useState } from "react";
import "./AddCake.css";
import { assets } from "../../assets/admin_assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";

const AddCake = () => {
  const url = "http://localhost:5000/api/cakes";
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    productName: "",
    description: "",
    price: "",
    qty: 1,
    category: "Butter Cake",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("qty", Number(data.qty));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(url, formData);
      if (response.data.success) {
        setData({
          productName: "",
          description: "",
          price: "",
          qty: 1,
          category: "Butter Cake",
        });
        setImage(false);
        toast.success("Cake added successfully!");
      }
    } catch (error) {
      console.error("Error adding cake:", error);
      toast.error(error.response?.data?.message || "Error adding cake");
    }
  };

  return (
    <div className="add-cake-container">
      <div className="add-cake-header">
        <h1 className="add-cake-title">Add New Cake</h1>
        <p className="add-cake-subtitle">
          Create a delicious new addition to your menu
        </p>
      </div>

      <form className="add-cake-form" onSubmit={onSubmitHandler}>
        <div className="form-grid">
          {/* Image Upload Section */}
          <div className="image-upload-section">
            <h3 className="section-title">Cake Image</h3>
            <div className="image-upload-container">
              <label htmlFor="image" className="image-upload-label">
                {image ? (
                  <div className="image-preview">
                    <img src={URL.createObjectURL(image)} alt="Cake preview" />
                    <div className="image-overlay">
                      <span>Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <img src={assets.upload_area} alt="Upload" />
                    <h4>Upload Cake Image</h4>
                    <p>Click here or drag & drop your image</p>
                  </div>
                )}
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                accept="image/*"
                hidden
                required
              />
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="form-fields-section">
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Product Name</span>
                <span className="required">*</span>
              </label>
              <input
                onChange={onChangeHandler}
                value={data.productName}
                type="text"
                name="productName"
                placeholder="Enter cake name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                onChange={onChangeHandler}
                value={data.description}
                name="description"
                rows="4"
                placeholder="Describe your cake..."
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Category</span>
                  <span className="required">*</span>
                </label>
                <select
                  onChange={onChangeHandler}
                  value={data.category}
                  name="category"
                  className="form-select"
                  required
                >
                  <option value="Butter Cake">Butter Cake</option>
                  <option value="Layered Cake">Layered Cake</option>
                  <option value="Fruit Cake">Fruit Cake</option>
                  <option value="Cheese Cake">Cheese Cake</option>
                  <option value="Cup Cake">Cup Cake</option>
                  <option value="Theme Cake">Theme Cake</option>
                  <option value="Donut">Donut</option>
                  <option value="Pastries">Pastries</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Price</span>
                  <span className="required">*</span>
                </label>
                <div className="input-with-prefix">
                  <span className="input-prefix">₹</span>
                  <input
                    onChange={onChangeHandler}
                    value={data.price}
                    type="number"
                    name="price"
                    placeholder="0.00"
                    className="form-input with-prefix"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Quantity</span>
                  <span className="required">*</span>
                </label>
                <input
                  onChange={onChangeHandler}
                  value={data.qty}
                  type="number"
                  name="qty"
                  placeholder="1"
                  className="form-input"
                  required
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            <span className="btn-icon">+</span>
            Add Cake to Menu
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCake;
