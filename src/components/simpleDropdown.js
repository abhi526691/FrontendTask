import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 220,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
});

class SimpleDropdown extends React.Component {
  state = {
    dropDownValue: '',
    labelWidth: 0,
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }

  handleChange = event => {
    this.setState({ dropDownValue: event.target.value });
    this.props.onSelect(event.target.value);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { data, onSelect, title, classes, defaultValue } = this.props;
    const htmlFor = `${title}-simple`;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel
              htmlFor={htmlFor}
              ref={ref => {
                this.InputLabelRef = ref;
              }}
            >
              {title.toUpperCase()}
            </InputLabel>
            <Select
              value={this.state.dropDownValue}
              onChange={this.handleChange}
              input={
                <OutlinedInput
                  labelWidth={this.state.labelWidth}
                  name={title}
                  id={htmlFor}
                />
              }
              inputProps={{
                  name: title,
                  id: htmlFor,
              }}
            >
                {defaultValue !== undefined && defaultValue !== "" &&
                  <MenuItem key={defaultValue} value={defaultValue} onClick={this.handleClose}>
                      {defaultValue}
                  </MenuItem>
                }
                {data.map((item, index) => <MenuItem key={item} value={item} onClick={this.handleClose}>{item}</MenuItem>)}
            </Select>
        </FormControl>
      </form>
    );
  }
}

SimpleDropdown.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleDropdown);
