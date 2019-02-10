import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = (props) => (
    <div className="not-found-page">
      {
        !props.customMessage ?
        <div className="not-found-page__box">
          <h1 className="not-found-page__title ">Sorry!</h1>
          <h5 className="not-found-page__text">We can't find the page you're looking for.</h5>
          <p className="not-found-page__text">(404) - <Link className="not-found-page--text" to="/">Go home</Link></p>
        </div> :
        <div className="not-found-page__box">
          <h5 className="not-found-page__text">{props.customMessage}</h5>
          <p style={{opacity: '0.5', fontStyle: 'italic'}} className="not-found-page__text">there is no products added</p>
        </div>
      }
    </div>
  )

export default NotFoundPage;
