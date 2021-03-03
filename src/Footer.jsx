import React from 'react';

import './Footer.css';

export default class Footer extends React.Component {
    render() {
        return <div className='footer'>
            <span>© 2021</span>
            <a href="https://github.com/zavyalovdmitry">zavyalovdmitry</a>
            <span>for</span>
            <a href="https://rs.school/js/"><img src="https://rs.school/images/rs_school_js.svg" alt="rsschool" height="20"></img></a>
        </div>
    }
}

// author github
// year
// course
// youtube