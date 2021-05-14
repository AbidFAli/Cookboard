import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';



const TimingInfo = ({timeToMake, setTimeToMake, editable}) => {
  const handleChangeTTMValue = (newValue) => {
      let newTimeToMake = {...timeToMake}
      newTimeToMake.value = newValue
      setTimeToMake(newTimeToMake)
  }

  const handleChangeTTMUnit = (newUnit) => {
      let newTimeToMake = {...timeToMake}
      newTimeToMake.unit = newUnit
      setTimeToMake(newTimeToMake)
  }
  if(editable){
      return(
          <React.Fragment>
              <TextField
                  name = "fieldTimeToMakeValue"
                  defaultValue= {timeToMake != null ? timeToMake.value : ''}
                  label = "Prep Time(value)"
                  onChange = {(event) => handleChangeTTMValue(event.target.value)}
              />
              <TextField
                  name = "fieldTimeToMakeUnit"
                  defaultValue= {timeToMake != null ? timeToMake.unit : ''}
                  label = "Prep Time(unit)"
                  onChange = {(event) => handleChangeTTMUnit(event.target.value)}
              />
          </React.Fragment>
      )
  }
  else{
      return(
          <Typography variant="h4">
              {timeToMake != null ? timeToMake.value + ' ' + timeToMake.unit : ''}
          </Typography>
      )
  }
}

export default TimingInfo;