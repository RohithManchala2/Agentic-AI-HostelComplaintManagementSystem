import React, { useState } from "react";
import styles from "./NewComplaint.module.css";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const NewComplaint = () => {
  const { axios } = useAppContext();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !description) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/complaint/create",
        { title, category, description },
        { withCredentials: true }
      );

      toast.success(data.message);

      setTitle("");
      setCategory("");
      setDescription("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit complaint");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Submit a Complaint</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Internet">Internet</option>
          <option value="Carpentry">Carpentry</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default NewComplaint;
