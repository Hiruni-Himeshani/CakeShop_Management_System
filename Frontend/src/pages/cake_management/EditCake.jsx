import React, { useEffect, useState } from "react";
import "./EditCake.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/admin_assets/assets";

const EditCake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = "http://localhost:5000/api/cakes";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [data, setData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "Layer Cakes",
    qty: "",
  });

  // Fetch cake data for editing
  const fetchCakeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/${id}`);
      if (response.data.success) {
        const cake = response.data.data;
        setData({
          productName: cake.productName,
          description: cake.description,
          price: cake.price,
          category: cake.category,
          qty: cake.qty,
        });
        setCurrentImageUrl(`http://localhost:5000/uploads/${cake.image}`);
      } else {
        toast.error("Error fetching cake data");
        navigate("/admin/cakelist");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error loading cake data");
      navigate("/admin/cakelist");
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!data.productName || !data.description || !data.price || !data.qty) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("qty", Number(data.qty));

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.patch(`${url}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Cake updated successfully!");
        navigate("/admin/cakelist");
      } else {
        toast.error("Error updating cake");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating cake");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCakeData();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="edit-cake-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cake data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-cake-container">
      {/* Header Section */}
      <div className="edit-cake-header">
        <button
          className="back-btn"
          onClick={() => navigate("/admin/cakelist")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="m19 12H5"></path>
          </svg>
          Back to List
        </button>
        <h1 className="edit-cake-title">Edit Cake</h1>
        <p className="edit-cake-subtitle">
          Update cake information and details
        </p>
      </div>

      {/* Form Container */}
      <form className="edit-cake-form" onSubmit={onSubmitHandler}>
        <div className="form-grid">
          {/* Image Upload Section */}
          <div className="image-upload-section">
            <h3 className="section-title">Cake Image</h3>
            <div className="image-upload-container">
              <label htmlFor="image" className="image-upload-label">
                {image ? (
                  <div className="image-preview">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="New cake preview"
                    />
                    <div className="image-overlay">
                      <span>Click to change image</span>
                    </div>
                  </div>
                ) : currentImageUrl ? (
                  <div className="image-preview">
                    <img src={currentImageUrl} alt="Current cake" />
                    <div className="image-overlay">
                      <span>Click to change image</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <img src={assets.upload_area} alt="Upload" />
                    <h4>Upload New Image</h4>
                    <p>Click to select a new image file</p>
                  </div>
                )}
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                accept="image/*"
                hidden
              />
            </div>
            <p className="image-note">Leave empty to keep current image</p>
          </div>

          {/* Form Fields Section */}
          <div className="form-fields-section">
            <h3 className="section-title">Cake Details</h3>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Cake Name</span>
                <span className="required">*</span>
              </label>
              <input
                onChange={onChangeHandler}
                value={data.productName}
                type="text"
                name="productName"
                placeholder="e.g. Chocolate Fudge Cake"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Description</span>
                <span className="required">*</span>
              </label>
              <textarea
                onChange={onChangeHandler}
                value={data.description}
                name="description"
                rows="4"
                placeholder="Describe the cake's ingredients, flavor, and special features..."
                className="form-textarea"
                required
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
                >
                  <option value="Layer Cakes">Layer Cakes</option>
                  <option value="Cupcakes">Cupcakes</option>
                  <option value="Cheesecakes">Cheesecakes</option>
                  <option value="Wedding Cakes">Wedding Cakes</option>
                  <option value="Birthday Cakes">Birthday Cakes</option>
                  <option value="Custom Cakes">Custom Cakes</option>
                  <option value="Seasonal Cakes">Seasonal Cakes</option>
                  <option value="Dessert Cakes">Dessert Cakes</option>
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
                    min="0"
                    step="0.01"
                    required
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
                  placeholder="0"
                  className="form-input"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/cakelist")}
          >
            Cancel
          </button>
          <button type="submit" className="update-btn" disabled={saving}>
            {saving ? (
              <>
                <div className="btn-spinner"></div>
                Updating...
              </>
            ) : (
              <>
                <span className="btn-icon">✓</span>
                Update Cake
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCake;
