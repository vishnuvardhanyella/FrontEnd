import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoBookmark } from 'react-icons/io5';
import { FaShareNodes } from 'react-icons/fa6';
import './Header.css';

const Header = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);
  const [disableHoverEffect, setDisableHoverEffect] = useState(false);

  const toggleBookmark = () => {
    try {
      const isCurrentlyBookmarked = localStorage.getItem('isBookmarked') === 'true';

      // Toggle the bookmark status
      const updatedBookmarkStatus = !isCurrentlyBookmarked;

      // Update the local storage
      localStorage.setItem('isBookmarked', updatedBookmarkStatus);

      // Update the state
      setIsBookmarked(updatedBookmarkStatus);

      // After successful bookmark
      setShowBookmarkPopup(true);
      setTimeout(() => {
        setShowBookmarkPopup(false);
      }, 2000); // Adjust the timeout duration as needed

      // Provide feedback to the user (you can customize this part)
      if (updatedBookmarkStatus) {
        console.log('Bookmarked successfully!');
      } else {
        console.log('Bookmark removed!');
      }

      // Disable hover effect after clicking
      setDisableHoverEffect(true);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleShare = async () => {
    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        // Check if another share operation is in progress
        if (navigator.shareQueue) {
          console.log('Share operation already in progress. Please wait.');
          return;
        }

        // Set shareQueue flag to prevent concurrent shares
        navigator.shareQueue = true;
      }

      const shareData = {
        title: 'Your Website Title',
        text: 'Check out this awesome website!',
        url: window.location.href,
      };

      await navigator.share(shareData);
      setIsShared(true);
      console.log('Shared successfully!');
    } catch (err) {
      console.error(`Error: ${err}`);
    } finally {
      // Reset the shareQueue flag after the share operation
      if (navigator.share) {
        navigator.shareQueue = false;
      }
    }

    // Disable hover effect after clicking
    setDisableHoverEffect(true);
  };

  const scrollingSentence = 'Your scrolling sentence goes here';

  return (
    <header className="header-container">
      <div className="header-left">
        <Link to="/">
          <img src="logo_transparent.png" alt="Your Logo" className="header-logo" />
        </Link>
      </div>
      <div className="header-center">
        <p className="scrolling-sentence">{scrollingSentence}</p>
      </div>
      <div className="header-right">
        <button
          className={`header-icon ${isBookmarked ? 'active' : ''} ${disableHoverEffect ? 'disable-hover' : ''}`}
          onClick={toggleBookmark}
        >
          <IoBookmark />
          <span className="icon-text">Bookmark</span>
        </button>
        <button
          className={`header-icon ${isShared ? 'active' : ''} ${disableHoverEffect ? 'disable-hover' : ''}`}
          onClick={handleShare}
        >
          <FaShareNodes />
          <span className="icon-text">Share</span>
        </button>
      </div>
      {showBookmarkPopup && (
        <div className="bookmark-popup">
          Bookmark {isBookmarked ? 'added' : 'removed'} successfully!
        </div>
      )}
    </header>
  );
};

export default Header;
