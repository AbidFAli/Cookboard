import React from 'react';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';



const ID_FIELD_DESCRIPTION = "fieldDescription"
/*
 *@param props = {
 *  desc: recipe description; string
 *  stars: number of recipe stars; number
 * } 
 */
const DescriptionRating = ({editable, desc, setDesc, rating, setRating}) => {
    const handleChangeDesc = (newDesc) => {
        setDesc(newDesc)
        console.log('New description is' + newDesc)
    }
    let viewDescription;
    if(editable){
        viewDescription = (
            <TextField
                inputProps = {{'data-testid' : ID_FIELD_DESCRIPTION}}
                name = "fieldDescription"
                label = "Description"
                defaultValue= {desc} 
                onChange = {(event) => handleChangeDesc(event.target.value)}/>
        )
    }
    else{
        viewDescription = (
            <Typography data-testid = {ID_FIELD_DESCRIPTION} variant = "body1">
                {desc}
            </Typography>
        )
    }

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography variant="h5" gutterBottom>
                    Description
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h5" gutterBottom>
                    Rating
                </Typography>
            </Grid>
            <Grid item xs={6}>
                {viewDescription}
            </Grid>
            <Grid item xs={6}>
                <Rating 
                  name = "rating" 
                  value = {rating}
                  readOnly = {!editable}
                  preciscion = {0.5}
                  onChange = {(event, newRating) => setRating(newRating) }
                />
            </Grid>
        </Grid>
    )
}

export { 
    DescriptionRating,
    ID_FIELD_DESCRIPTION
}