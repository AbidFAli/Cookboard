import React, {useState} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const ServingInfoList = ({servingInfo, setServingInfo, editable}) => {

  const handleChangeNumServed = (numServed) => {
    let newServingInfo = {...servingInfo}
    newServingInfo.numServed = numServed
    setServingInfo(newServingInfo)
  }
  const handleChangeYield = (servingYield) => {
    let newServingInfo = {...servingInfo}
    newServingInfo.yield = servingYield
    setServingInfo(newServingInfo)
  }
  const handleChangeServingSize = (servingSize) => {
    let newServingInfo = {...servingInfo}
    newServingInfo.servingSize = servingSize
    setServingInfo(newServingInfo)
  }
  const handleChangeServingSizeUnit = (unit) => {
    let newServingInfo = {...servingInfo}
    newServingInfo.unit = unit
    setServingInfo(newServingInfo)
  }

  let content;
  if(editable){
    content = (
      <List component = "ul">
        <ListItem>
          <TextField
            name = "fieldNumServed"
            defaultValue= {servingInfo != null ? servingInfo.numServed : ''}
            label = "Number Served"
            onChange = {(event) => handleChangeNumServed(event.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            name = "fieldYield"
            defaultValue= {servingInfo != null ? servingInfo.yield : ''}
            label = "Yield"
            onChange = {(event) => handleChangeYield(event.target.value)}
            />
        </ListItem>
        <ListItem>
          <TextField
            name = "fieldServingSize"
            defaultValue= {servingInfo != null ? servingInfo.servingSize : ''}
            label = "Serving Size"
            onChange = {(event) => handleChangeServingSize(event.target.value)}
            />
          <TextField
            name = "fieldServingSizeUnit"
            defaultValue= {servingInfo != null ? servingInfo.unit : ''}
            label = "Unit"
            onChange = {(event) => handleChangeServingSizeUnit(event.target.value)}
            />
        </ListItem>
      </List>
    )
  }
  else if(!editable && servingInfo != null){
    content = (
      <List component = "ul">
      <ListItem>
          <ListItemText primary={`Serves: ${servingInfo.numServed}`} />
      </ListItem>
      <ListItem>
          <ListItemText primary={`Yield: ${servingInfo.yield} servings`} />
      </ListItem>
      <ListItem>
          <ListItemText primary={`Serving size: ${servingInfo.servingSize} ${servingInfo.unit}`} />
      </ListItem>
      </List>
    );
  }
  return(
      <Paper>
          <Typography variant="h5" gutterBottom>
              Serving Info
          </Typography>
          {content}
      </Paper>
  );
}

export default ServingInfoList;