import React from "react"

class ErrorMessage extends React.Component{
    render(){
      return <p>{this.props.message}</p>
    }
}

export default ErrorMessage