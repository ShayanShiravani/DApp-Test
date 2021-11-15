import React, { Component } from 'react';
import '../App.css';
// import axios from 'axios';

const Web3 = require("web3");

class SendEth extends Component {

  constructor() {
    super();
    this.state = {
      account: '',
      listenerAttached: false,
      destinationAddress: '',
      amount: '',
    };
    //this.setCurrentAccount = this.setCurrentAccount.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    this.handleAccountsChanged();
  }

  componentWillUnmount() {
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    if (errors.length > 0) {
      errors.forEach(function(error){
        alert(error);
      });
      return false;
    }
    window.web3 = new Web3(window.ethereum);
    const data = {
      from:this.state.account,
      to:this.state.destinationAddress.trim(),
      value:window.web3.utils.toWei(this.state.amount.trim(), "ether"),
      chain:"ropsten"
    };
    console.log(data);
    window.web3.eth.sendTransaction(data)
      .on('transactionHash', function(hash){
        console.log("Transaction hash is " + hash);
      })
      .on('receipt', function(receipt){
        console.log("Transaction receipt is " + receipt)
      });
    this.setState({amount:''});
    this.setState({destinationAddress:''});
    // const data = {
    //   address: this.state.address,
    // };

    // axios
    //   .get('http://localhost:8082/api/accounts', data)
    //   .then(res => {
    //     this.setState({
    //       address: '',
    //     })
    //     this.props.history.push('/');
    //   })
    //   .catch(err => {
    //     console.log("Error in inquiry account!");
    //   })
  };

  validate = () => {
    const errors = [];
  
    if (this.state.amount.length === 0) {
      errors.push("Amount can't be empty");
    }
    if(!this.state.amount.match(('?:\d+\.\d*')|('?:\d*\.?\d+')))
    {
      errors.push("Amount value isn't valid");
    }
    if (this.state.destinationAddress.length === 0) {
      errors.push("Destination address can't be empty");
    }
    if(this.state.destinationAddress == this.state.account)
    {
      errors.push("Destination address can't be the same as source");
    }
    if(this.state.account == '')
    {
      errors.push("No accounts are active");
    }
    return errors;
  }

  handleAccountsChanged = async() => 
  {
    window.web3 = new Web3(window.ethereum);
    const accounts = await window.web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({account:''});
      alert('Please connect to MetaMask.');
    } else if (accounts[0] !== this.state.account) {
      this.setState({account:accounts[0]});
      console.log("Current address is " + this.state.account);
    }
  }

  enableEthereum()
  {
    const ethEnabled = async () => {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          // window.web3 = new Web3(window.ethereum);
          // this.setState({account:result});
          // this.handleAccountsChanged();
          if(!this.state.listenerAttached)
          {
            this.setState({listenerAttached:true});
            this.handleAccountsChanged();
            window.ethereum.on('accountsChanged', () => {
              this.handleAccountsChanged();
            });
          }
        })
        .catch((err) => {
          switch(err.code)
          {
            case 4001:
              alert("Please connect to MetaMask.");
              break;
            case -32002:
              alert("You have a pending request so connect MetaMask manually, please.");
              break;
            default:
              console.error(err);
              break;
          }
        });
    }
    ethEnabled();
  }

  render() {
    return (
      <div className="SendEthereum align-middle">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <br/>
              <button className="btn btn-outline-warning float-left enableEthereumButton" onClick={this.enableEthereum.bind(this)}>Connect MetaMask</button>
              <br/>
              <br/>
              <h1 className="display-4 text-center">Send ETH</h1>

              <form noValidate onSubmit={this.onSubmit}>
              <div className='form-group'>
                  <input
                    type='text'
                    placeholder='Amount (ETH)'
                    name='amount'
                    className='form-control'
                    value={this.state.amount}
                    onChange={this.onChange}
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='text'
                    placeholder='Destination address'
                    name='destinationAddress'
                    className='form-control'
                    value={this.state.destinationAddress}
                    onChange={this.onChange}
                  />
                </div>
                <input
                    type="submit"
                    className="btn btn-outline-warning btn-block mt-4"
                    value="send"
                />
              </form>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SendEth;