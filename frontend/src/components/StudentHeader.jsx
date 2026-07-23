import React from 'react'
import styles from "./StudentHeader.module.css"
import { useAppContext } from '../context/AppContext'

const StudentHeader = () => {
  const {navigate}=useAppContext();
  return (
       <div className={styles.header}>
      <div>
        <h1>Quick Overview</h1>
        <p>Track your complaint status</p>
      </div>

      <button onClick = {()=>{navigate("/student/newcomplaints")}}>+ New Complaint</button>
    </div>
  )
}

export default StudentHeader