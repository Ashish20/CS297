import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { WithContext as ReactTags } from 'react-tag-input';

// import components
import Alert from '../../components/Alert';

// import styles
import './Signup.scss';
import { resolveSoa } from 'dns';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      userType: '',
      errMsg: '',
      address: '',
      zip: '',
      designation: '',
      categories: [
        { id: 'electricity', text: 'Electricity' },
        { id: 'water', text: 'Water' },
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
  }

  componentWillMount() {
    if (this.props.loggedIn) {
      return this.props.history.push('/profile');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.loggedIn) {
      nextProps.history.push('/profile');
      return false;
    }
    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      email,
      password,
      userType,
      address,
      zip,
      name,
      designation,
      categories,
    } = this.state;
    Accounts.createUser(
      {
        email,
        password,
        profile: { userType, address, zip, name, designation, categories },
      },
      err => {
        if (err) {
          this.setState({ errMsg: err.reason });
          return console.log(err);
        }
      }
    );
  }

  handleAddition(tag) {
    this.setState(state => ({ categories: [...state.categories, tag] }));
  }

  handleDelete(i) {
    const { categories } = this.state;
    this.setState({
      categories: categories.filter((tag, index) => index !== i),
    });
  }

  representativeFields() {
    const categories = this.state;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="designation">Designation</label>
          <input
            id="designation"
            type="text"
            className="form-control"
            name="designation"
            value={this.state.designation}
            onChange={e => this.setState({ designation: e.target.value })}
            required
          />
        </div>

        <div>
          <ReactTags
            categories={categories}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            // handleDrag={this.handleDrag}
            delimiters={delimiters}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    if (this.props.loggedIn) {
      return null;
    }

    const { errMsg } = this.state;
    return (
      <section className="signup-page">
        <div className="card mx-auto" style={{ maxWidth: '28rem' }}>
          <div className="card-header">
            <div className="brand">
              <div className="text-center">
                <img
                  className="rounded-circle"
                  src="https://via.placeholder.com/150x150"
                  alt="logo"
                />
              </div>
            </div>
            <div className="card-body">
              <h4 className="card-title">Sign up</h4>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="name"
                    className="form-control"
                    name="name"
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-Mail Address</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={e => this.setState({ password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    type="address"
                    className="form-control"
                    name="address"
                    value={this.state.address}
                    onChange={e => this.setState({ address: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zip">Zip Code</label>
                  <input
                    id="zip"
                    type="zip"
                    className="form-control"
                    name="zip"
                    value={this.state.zip}
                    onChange={e => this.setState({ zip: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="userType">Register As</label>
                  <select
                    id="userType"
                    className="form-control"
                    name="userType"
                    value={this.state.userType}
                    onChange={e => this.setState({ userType: e.target.value })}
                    required
                  >
                    <option value="" disabled selected>
                      Select your option
                    </option>
                    <option value="representative">Representative</option>
                    <option value="citizen">Citizen</option>
                  </select>
                </div>

                {this.state.userType == 'representative' &&
                  this.representativeFields()}

                <div className="form-group">
                  <label>
                    <input type="checkbox" name="aggree" value="1" required /> I
                    agree to the Terms and Conditions
                  </label>
                </div>
                <div className="form-group no-margin">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-2"
                  >
                    Sign up
                  </button>
                  {errMsg && <Alert errMsg={errMsg} />}
                </div>
                <div className="margin-top20">
                  Already have an account? <NavLink to="/login">Login</NavLink>
                </div>
              </form>
            </div>
          </div>
          <div className="footer text-center">
            &copy; {new Date().getFullYear()}
          </div>
        </div>
      </section>
    );
  }
}

Signup.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Signup;
