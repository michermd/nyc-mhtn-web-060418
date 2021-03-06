import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import NavBar from './NavBar';
import Welcome from './Welcome';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Snacks from './Snacks';
import MySnacks from './MySnacks';
import SnackAdapter from '../apis/SnackAdapter';
import withAuth from '../hocs/withAuth';
import withLoading from '../hocs/withLoading';
import withAd from '../hocs/withAd';

// const AuthedRegistrationForm = withAuth(RegistrationForm);
// const AuthedLoginForm = withAuth(LoginForm);
const AuthedSnacks = withAuth(Snacks);
const AuthedMySnacks = withAuth(MySnacks);

// sessions are stored in the server but where????
// database, memory, filesystem
// blacklist => refresh tokens => iat, exp => 2-factor-auth
class App extends Component {
  state = {
    userId: null
  }

  // Logout => remove token, redirect home (or login/registration), clear userId in App

  // How can we get back the userId after the app refreshes?
  componentDidMount() {
    // route for fetching ID from token
    SnackAdapter.getProfile()
      .then(json => {
        this.updateUserId(json.id);
      });
  }

  updateUserId = (id) => {
    this.setState({ userId: id });
  }

  render() {
    // const LoadingMyAuthedSnacks = withLoading(AuthedMySnacks, () => SnackAdapter.getMySnacks(this.state.userId))

    return (
        <div className="App">
          <NavBar />

          <Route exact path="/" component={Welcome} />
            {
              !SnackAdapter.isLoggedIn() ?
              <Fragment>
                <Route exact path="/register" component={RegistrationForm} />
                <Route exact path="/login" render={(routerProps) => <LoginForm {...routerProps} onSuccessfulLogin={this.updateUserId} />} />
              </Fragment>
              :
              null
            }
          <Route exact path="/snacks" component={AuthedSnacks} />
          <Route
            exact
            path="/my-snacks"
            render={(routerProps) => <AuthedMySnacks {...routerProps} userId={this.state.userId} />}
          />
        </div>
    );
  }
}

export default withAuth(withLoading(withAd(App), SnackAdapter.getProfile));
