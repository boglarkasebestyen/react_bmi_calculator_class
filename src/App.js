    import React from 'react'
    import './App.css'
    import Slider from 'react-rangeslider'
    import 'react-rangeslider/lib/index.css'

    const minHeight = 95
    const maxHeight = 220
    const minWeight = 10
    const maxWeight = 300
    const slimThre = 18.5
    const normalThre = 24.9
    const fatThre = 29.9


    class App extends React.Component {
      constructor() {
        super()
        this.state = {
          height: "",
          weight: "",
          heightErr: "",
          weightErr: "",
          bmiValue: "",
          bmiText: "",
          text: "",
          chonkVisibility : "invisibleChonk",
          resultChonk: "",
          AllChonkImg: {
            slimChonk: ["./images/slim/1.jpg", "./images/slim/2.jpg", "./images/slim/3.jpg", "./images/slim/4.jpg"],
            normalChonk: ["./images/normal/1.jpg", "./images/normal/2.jpg", "./images/normal/3.jpg", "./images/normal/4.jpg", "./images/normal/5.jpg"],
            fatChonk: ["./images/fat/1.jpg", "./images/fat/2.jpg", "./images/fat/3.jpg", "./images/fat/4.jpg"],
            tooFatChonk: ["./images/2fat/1.jpg", "./images/2fat/2.jpg", "./images/2fat/3.jpg", "./images/2fat/4.jpg", "./images/2fat/5.jpg", "./images/2fat/6.jpg"]
          }
        }

        this.calcBmi = this.calcBmi.bind(this)
      }


      handleHeightChange(event) { //spinner
        this.setState({ height: event.target.value})
      }

      handleWeightChange(event) { //spinner
        this.setState({ weight: event.target.value})
      }

      handleHeightSliderChange(value) { //range
        this.setState({ height: value})
      }

      handleWeightSliderChange(value) { //range
        this.setState({ weight: value})
      }

      //limiting input to numbers
      handleKeyPress(source, event) {
        const allowedChars = ".0123456789"
        const currentChar = event.key
        let found = false
        for (let i = 0;  i < allowedChars.length; i++) {
          if (currentChar === allowedChars[i]) {
            found = true
          }
        }
        if(found === false) {
          event.preventDefault()
          return
        }

        //limiting number input in height/weight
        let currentValue = ""   
            if (source === 'height') {
              currentValue = parseInt(this.state.height + currentChar)
              if (currentValue > maxHeight) {
                event.preventDefault()
              } 
            } else {
              currentValue = parseInt(this.state.weight + currentChar)
              if (currentValue > maxWeight) {
                event.preventDefault()
              }
            }

            if(currentValue === 0) {
                event.preventDefault()
            }
      }

        //classifying the results w/images, calculating BMI
        classifyResult(result) {
          if (result < slimThre) {
            return "slim"
          }
          if (result <= normalThre) {
            return "normal"
          }
          if (result <= fatThre) {
            return "fat"
          }
          return "tooFat"
        }

        //height, weight validation and min/max manual input nrs 
        validate() {
          this.setState({heightErr: "", weightErr: ""})

          let heightErrStr = ""
          let weightErrStr = ""


          //error messageges for H/W
        if(!this.state.height) {
          heightErrStr = "Please, enter height"
        } else if(this.state.height < minHeight) {
          heightErrStr = "Greater than 95, please"
        } else if(this.state.height > maxHeight) {
          heightErrStr = "Less than 220, please"
        }
          
        if(!this.state.weight) {
          weightErrStr = "Please, enter weight"
        } else if(this.state.weight < minWeight) {
           weightErrStr = "Greater than 10, please"
        } else if(this.state.weight > maxWeight) {
           weightErrStr = "Less than 300, please"
        }
      
       if(heightErrStr || weightErrStr) { 
          this.setState({heightErr: heightErrStr, weightErr: weightErrStr}) 
          return false 
        }
        return true 
      }


      calcBmi(event) {
        if(!this.validate()) {
          return 
      }



        let bmi = (this.state.weight / (this.state.height/100 * this.state.height/100)).toFixed(1)
        let chonks = null
        let resultString = ""


        switch (this.classifyResult(bmi)) {
          case "slim": {
            chonks = this.state.AllChonkImg.slimChonk
            resultString = "You're pretty slonky, have a KitKat!"
            break
          }
          case "normal": {
            chonks = this.state.AllChonkImg.normalChonk
            resultString = "You're okay...for now."
            break
          }
          case "fat": {
            chonks = this.state.AllChonkImg.fatChonk
            resultString = "You're getting kind of fat..."
            break
          }
          case "tooFat": {
            chonks = this.state.AllChonkImg.tooFatChonk
            resultString = "You're quite the chonker, there!"
            break
          }
           default:{}
        }

          //gettind random images & avoiding duplicates
          const randNum = Math.floor(Math.random() * chonks.length)
          const randChonk = chonks[randNum]


          if(this.state.resultChonk === randChonk) {
            this.calcBmi(event)
            return
          }

          this.setState({resultChonk: randChonk})
          this.setState({chonkVisibility: "visibleChonk" })  
          this.setState({bmiText: resultString})
          this.setState({bmiValue: bmi}) 
          this.setState({text: "invisibleChonk"})
        }


        // clear button
        clear(event) {
          event.preventDefault()
          this.setState({ height: "", weight: "", bmiValue: "" })
          this.setState({ chonkVisibility: "invisibleChonk" })
          this.setState({ heightErr: "", weightErr: "" })
          this.setState({ text: "visibleChonk"})
        }


        render() {
          return ( 
            <div id="container"> 
              <div id="title">
                <h1>Calculate Your Body Mass Index</h1>
              </div>
                <form>
                  <div className="unit">
                    <p>Height (95cm-220cm)</p>
                  </div>
                    <input 
                       type="number" 
                       name="height" 
                       step="1" 
                       placeholder="cm" 
                       min={minHeight} 
                       max={maxHeight} 
                       value={this.state.height}
                       onChange={this.handleHeightChange.bind(this)}
                       onKeyPress={this.handleKeyPress.bind(this, 'height')}
                     />

                     <div className="error">{this.state.heightErr}</div>
                     <div className="slider">
                      <Slider 
                        min={minHeight} 
                        max={maxHeight} 
                        step={1} 
                        value={this.state.height} 
                        onChange={this.handleHeightSliderChange.bind(this)}
                      />  
                     </div>              

                    <br />

                    <div className="unit">
                      <p>Weight (10kg-300kg)</p>
                    </div>
                      <input 
                         type="number" 
                         name="weight" 
                         step="0.5" 
                         placeholder="kg" 
                         min={minWeight} 
                         max={maxWeight} 
                         value={this.state.weight} 
                         onChange={this.handleWeightChange.bind(this)}
                         onKeyPress={this.handleKeyPress.bind(this, 'weight')}
                      />

                     <div className="error">{this.state.weightErr}</div>

                     <div className="slider">
                      <Slider
                        min={minWeight} 
                        max={maxWeight} 
                        step={0.5} 
                        value={this.state.weight} 
                        onChange={this.handleWeightSliderChange.bind(this)}
                      />
                     </div>

                     <br />

                     <div id="buttons-container">
                      <button 
                        className="button" 
                        onClick={event => {
                          event.preventDefault()
                          this.calcBmi()
                        }}
                        >Calculate
                      </button>

                    <br />

                      <button 
                        className="button" 
                        onClick={this.clear.bind(this)}
                        >Clear
                      </button>
                    </div>

                    <br />

                </form>

                <div className={this.state.chonkVisibility}>
                  <div id="image">
                    <img src={this.state.resultChonk} alt="pictures of cats" />
                  </div>
                  <div id="result-top-text">
                    <p>Your current BMI: {this.state.bmiValue} </p>
                  </div>
                <div id="bmi-text">{this.state.bmiText}</div>
                </div>

                <div className={this.state.text}>
                <div id="text">
                  Body mass index, abbreviated BMI, is a key index for relating weight to height. 
                  <br />
                  <br />
                  BMI is a person's weight in kilograms (kg) divided by his or her height in meters squared.
                  The National Institutes of Health (NIH) now defines normal weight, overweight, and obesity according to 
                  BMI rather than the traditional height/weight charts.
                  <ul>
                    <li>Overweight is a BMI of 25–29.9</li>
                    <li>Obesity is a BMI of 30 or more</li>
                  </ul>
                  A very muscular person might have a high BMI without health risks.
                </div>
              </div>
        </div> //container
      ) 
    }
  }

export default App
