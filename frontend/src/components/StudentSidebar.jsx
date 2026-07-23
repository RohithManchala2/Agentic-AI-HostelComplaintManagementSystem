import React from 'react'
import { NavLink } from "react-router-dom";
import styles from "./StudentSidebar.module.css"
import { useAppContext } from '../context/AppContext'

const StudentSidebar = () => {
  const { logout, user } = useAppContext();
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        HostelCare
        <span>Student Panel</span>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/student" className={styles.link}>Dashboard</NavLink>
        <NavLink to="/student/complaints" className={styles.link}>My Complaints</NavLink>
        <NavLink to="/student/newcomplaints" className={styles.link}>New Complaint</NavLink>
      </nav>

      <div className={styles.footer}>
        <p>{user?.fullName || 'Guest'}</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    </div>
  )
}

export default StudentSidebar