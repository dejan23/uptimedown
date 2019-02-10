import React from 'react';
import { connect } from 'react-redux';
import AccountSettings from './AccountSettings';
import AccountPassword from './AccountPassword';
import AccountDelete from './AccountDelete';
import { startSetUserProfile } from '../../actions/user'
import NotFoundPage from '../NotFoundPage';
import LoadingPage from '../LoadingPage';


export class AccountOptions extends React.Component {
  constructor(props) {
    super(props);
    if(!this.props.user) {
      this.props.startSetUserProfile()
    }
  }

  renderComponent() {
    if(this.props.match.url === "/user/account-settings") {
      return (
        this.props.user && <AccountSettings />
      )
    }

    if(this.props.match.url === "/user/account-password") {
      return (
        this.props.user && <AccountPassword />
      )
    }

    if(this.props.match.url === "/user/account-delete") {
      return (
        this.props.user && <AccountDelete />
      )
    }

  }

  render() {
    return (
      <div>
          {!this.props.user ? <h1><LoadingPage /></h1> : this.renderComponent()}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  user: state.user.user
})

export default connect(mapStateToProps, { startSetUserProfile })(AccountOptions)
