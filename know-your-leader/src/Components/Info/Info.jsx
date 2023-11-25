import React, { useState } from 'react';
import './info.css';

const Info = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleAccordion = (index) => {
    if (expanded === index) {
      setExpanded(null);
    } else {
      setExpanded(index);
    }
  };

  const questions = [
    {
        question: 'Why should I vote?',
        answer: "Your most sacred right Your right is the at the heart of our democracy Your chance to decide your future & that of your fellow citizens Gives you the ultimate power to shape the destiny of your country Every vote counts"
        
      },
    {
      question: 'Search your name in electoral rolls',
      answer: 'To search your name online on the rolls and find other details relating to your constituency, . [Link](https://electoralsearch.eci.gov.in/)',
    },
    {
      question: 'If You Are Enrolled for Elections,Dont Know Your polling booth?',
      answer: 'Simply Visit this Website,also You can find Your Area Officers(BLO,ERO,DEO) Details[Link](https://electoralsearch.eci.gov.in/pollingstation)',
    }, {
        question: 'Here’s How You Can Cast Your Vote',
        answer: 'First of all an official will confirm your name is present in electoral list or not. This official will also check your photo ID.Another polling official will ink your finger and provide you a slip after taking your signature on a register (Form 17A).Voter has to deposit that slip at the next polling official. Now, a voter can proceed to the voting machine.Now, a voter can cast its vote by pressing the button opposite the symbol of the candidate of own choice. The Electronic Voting Machine (EVM) will beep once you vote. VVPAT machine will provide a slip in the transparent window. Voter should check the Candidate serial No., Name and Symbol on the slip. This slip will appear for seven seconds only.If you don’t like any candidate then you have a choice to press NOTA (None of the above)',
      },
    // Add more questions and answers similarly
  ];

  return (
    <div className="info-container">
      <h2 className="info-heading">Frequently Asked Questions</h2>
      <div className="info-content">
        {questions.map((item, index) => (
          <div className="question" key={index}>
            <div className="question-header" onClick={() => toggleAccordion(index)}>
              <h3>{item.question}</h3>
              <span className={`dropdown-icon ${expanded === index ? 'open' : ''}`}>&#9660;</span>
            </div>
            <div className={`answer ${expanded === index ? 'open' : ''}`}>
              <p
                dangerouslySetInnerHTML={{
                  __html: item.answer.replace(
                    /\[Link\]\(([^)]+)\)/g,
                    '<a href="$1" target="_blank" rel="noopener noreferrer">Click Here</a>'
                  ),
                }}
              ></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Info;
