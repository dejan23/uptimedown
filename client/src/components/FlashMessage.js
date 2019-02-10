import React from 'react';
import { connect } from 'react-redux';


class FlashMessages extends React.Component {
  // componentWillUnmount() {
  //   if(this.props.message) {
  //     this.props.clearMessage()
  //     this.props.clearMessage2()
  //   }
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   if(nextProps.message) {
  //     setTimeout(() => {
  //       this.props.clearMessage()
  //       this.props.clearMessage2()
  //     }, 10000)
  //   }
  // }
  //
  // clearMessage() {
  //     this.props.clearMessage()
  //     this.props.clearMessage2()
  // }
  //
  //
  //
  //  closeMessage() {
  //   this.props.clearMessage()
  //   this.props.clearMessage2()
  // }
  //
  // renderMessage() {
  //   if(this.props.message) {
  //     return (
  //       <div className="success">
  //         <button onClick={this.closeMessage.bind(this)} className="close"><span>&times;</span></button>
  //         {this.props.message}
  //       </div>
  //     )
  //   }
  // }

  render() {
    return (
      <div className="success">
        {this.props.props}
        
      </div>

    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     message: state.auth.success || state.user.message
//   }
// }

export default connect()(FlashMessages);
