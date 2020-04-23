import React, { Component } from 'react'

const defaultState = {
  dark: false,  
  notFound:false,
  toggleDark: () => {},
}

const ThemeContext = React.createContext(defaultState)

class ThemeProvider extends Component {    
  state = {
    dark: false,    
  }

  componentDidMount() {
    const IsDark = JSON.parse(localStorage.getItem('theme'))

    if (IsDark) {
      this.setState({ dark: IsDark })
    }
  }

  componentDidUpdate(prevState) {
    const { dark } = this.state

    if (prevState.dark !== dark) {
      localStorage.setItem('dark', JSON.stringify(dark))
    }
  }

  toggleDark = () => {
    this.setState(prevState => ({ dark: !prevState.dark }))
  }

  setNotFound = () => {
    this.setState({ notFound: true })
  }

  setFound = () => {
    this.setState({ notFound: false })
  }

  render() {
    const { children } = this.props
    const { dark, notFound } = this.state

    return (
      <ThemeContext.Provider
        value={{
          dark,
          notFound,
          setFound: this.setFound,
          setNotFound: this.setNotFound,
          toggleDark: this.toggleDark,
        }}
      >
        {children}
      </ThemeContext.Provider>
    )
  }
}

export default ThemeContext

export { ThemeProvider }
