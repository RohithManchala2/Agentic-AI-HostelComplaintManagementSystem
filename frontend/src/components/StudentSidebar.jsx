import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import styles from "./StudentSidebar.module.css"
import { useAppContext } from '../context/AppContext'

const StudentSidebar = () => {
  const { logout, user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.sidebar}>
      <div className={styles.topBar}>
        <div className={styles.logo}>
          HostelCare
          <span>Student Panel</span>
        </div>
        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          ☰
        </button>
      </div>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
        <NavLink to="/student" className={styles.link} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
        <NavLink to="/student/complaints" className={styles.link} onClick={() => setIsOpen(false)}>My Complaints</NavLink>
        <NavLink to="/student/newcomplaints" className={styles.link} onClick={() => setIsOpen(false)}>New Complaint</NavLink>
      </nav>

      <div className={`${styles.footer} ${isOpen ? styles.footerOpen : ''}`}>
        <p>{user?.fullName || 'Guest'}</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    </div>
  )
}

export default StudentSidebar