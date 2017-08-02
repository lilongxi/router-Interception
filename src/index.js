import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, 
		Route, 
		withRouter, 
		NavLink, 
		Redirect } from 'react-router-dom';
		
import {getData} from './http/http';
		

const FilterLink = ({to ,children}) => {
	return(
		<li><NavLink to={to}>{children}</NavLink></li>
	)
}

const AuthRouter = () => {
	return(
		<Router>
			<div>
				<AuthButton />
				<ul>
					<FilterLink to="/public" >Public Page</FilterLink>
					<FilterLink to="/protected" >Protected Page</FilterLink>
					<FilterLink to="/detail" >Detail Page</FilterLink>
				</ul>
				<Route path="/public" component={Public}/>
      			<Route path="/login" component={Login}/>
      			<PrivateRoute path="/protected" component={Protected}/>
      			<PrivateRoute path="/detail" component={Detail}/>
			</div>
		</Router>
	)
}


const fakeAuth = {
	isAuthenticated: false,
	signin(){
		this.isAuthenticated = true
	},
	signout(){
		this.isAuthenticated = false
	}
}


//AuthButton

const AuthButton = withRouter(({history}) => {
	return(
		fakeAuth.isAuthenticated ? (
		    <p>
		      Welcome! <button onClick={() => {
		        fakeAuth.signout();
		        history.push('/');
		      }}>Sign out</button>
		    </p>
		  ) : (
		    <p>You are not logged in.</p>
		  )
	)
}) 

//public
const Public = () => {
	return(
		<h3>Public</h3>
	)
}

//protected
const Protected = () => {
	return(
		<h3>Protected</h3>
	)
}

//detail
const Detail = () => {
	return(
		<h3>detail</h3>
	)
}

//PrivateRoute
const PrivateRoute = ({component: Component, ...rest}) => {
	
	return (
		<Route {...rest} render={ props => ( 

			fakeAuth.isAuthenticated ?
			(<Component {...props}/>) : 
			(<Redirect to={{
		        pathname: '/login',
		        state: { from: props.location }
		      }}/>)
			
			
		)} />
	)
}


class Login extends React.Component{
	
	componentWillMount(){
		getData('http://106.14.175.146/')
			.then((data)=>{
				console.log(data);
			})
			.catch((err) => {
				console.log(err)
			})
	}
	
	state = {
	    redirectToReferrer: false
	  }
	
	login = () => {
	    fakeAuth.signin();
	    this.setState({ redirectToReferrer: true });
	 }

	
	render(){
		//其他页面跳至login，初始登录login
		const { from } = this.props.location.state || { from: { pathname: '/' } };
		const { redirectToReferrer } = this.state
    
	    if (redirectToReferrer) {
	      return (
	        <Redirect to={from}/>
	      )
	    }
		
		return (
	      <div>
	        <p>You must log in to view the page at {from.pathname}</p>
	        <button onClick={this.login}>Log in</button>
	      </div>
	    )
	}
}


ReactDOM.render(<AuthRouter />, document.getElementById('root'));
registerServiceWorker();
