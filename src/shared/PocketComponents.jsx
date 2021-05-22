import { _gc } from 'logic/gc';
import React, { useState, useRef, useEffect } from 'react';
import './PocketComponents.css';


// icons
import SpinnerIcon from 'ass/vector/files/spinner.svg';



export const TapForm = ({ data }) => {
  return(
    <>
      <h1>
        { `Tap ${ data.desc }` }
      </h1>
    </>
  );
}



/**
 * Standard values and variable calculations
 */
export const calendarValues = {
  year: parseInt(new Date().getFullYear().toString().slice(-2)),  // two digit year
  /**
   * Check if given year is a leap year
   * @param {number} mod year modifier from current
   * @returns boolean(true) if given year is a leap year
   */
  leap: function (mod=0) {
    return (this.year+mod) % 4 === 0;
  },
  months: 12,
  thisMonth: new Date().getMonth()+1, // default value
  month: null,  // selected value
  days: function (month) {
    let m = parseInt(month) // we need an int
    m > 7 && m++; // July and August both have 31 days
    let result = m === 2 ?  // check for february
      ( this.leap() ? 29 : 28 ) : // check if leap year
      m % 2 === 0 ? 30 : 31;
    this.day > result && ( this.day = result ); // set the highest value if selected value is higher than the length of the new month
    this.daysStatic = result;
    return result;
  },
  daysStatic: 28,
  today: new Date().getDate(),
  day: null,
  hours: 24,
  thisHour: new Date().getHours(),
  hour: null,
  minutes: 59,
  thisMinute: new Date().getMinutes(),
  minute: null
}



const selectOption = ( event, hero, value ) => {
  _r[`${ hero }Ref`].value = value;
  ddTransform(_r[`${ hero }Ref`]);
}
/**
 * generate arrays of Symbols for respective data
 */
const calendarOptions = {
  template: (key, value, hero, text=undefined) => {
    return <div key={ key } 
      className="Option"
      data-value={ value }
      data-hero={ hero }
      onClick={ (e)=>selectOption(e, hero, value) }>
        <h2>{ text || value }</h2>
      </div>
  },
  months: null,
  days: null,
  hours: null,
  minutes: null,
  /**
   * Generate elements
   * @param {string} target to calculate
   * @returns array with Symbols
   */
  calc: function (target) {
    this[target] = [];
    // days are special
    let values = target === 'days' ? calendarValues[target](calendarValues.month || calendarValues.thisMonth) : calendarValues[target];
    for ( let i='minutes'.includes(target) ? 0 : 1; i<=values; i++ ) {
      
      let form = ['hours', 'minutes'].includes(target) && i < 10 ? `0${ i }` : i; // format low values in hours and minutes to double digit string
      this[target].push(
        this.template(`${ target }${ form }`, form, target)
      );
    }
    return this[target];
  }
}


const ddHandler = ({ event=null, refs }) => {
  if ( refs.length > 1 )
    refs.forEach(ref => {
      ddTransform(ref);
    });
  else
    ddTransform(_r[`${ refs[0] }Ref`], event.deltaY % 2);
}

const ddTransform = ( ref, val=0 ) => {
  let hero = ref.dataset.hero;
  let calHero = hero.slice(0, -1);
  hero === 'days' && ( hero = 'daysStatic' );
  let mm = hero === 'minutes' ? 1 : 0;
  if ((( ref.value < calendarValues[hero] || val < 0) && (ref.value > 1-mm || val > 0 )) || val===0 ) {
    ref.value = parseInt(ref.value) + val;
    hero === 'months' && change(ref, 'month');
    calendarValues[calHero] = hero === 'minutes' ? ( ref.value < 10 ? `0${ ref.value }` : ref.value ) : ref.value;
    set(`${ calendarValues.month }/${ calendarValues.day } ${ calendarValues.hour }:${ calendarValues.minute }`, 'Cissi');
    let m = hero === 'minutes' ? 0 : 1; // this causes problems
    ref.dd.style.transform = `translate3D(0, ${ (ref.value-m) * -_r.ddh }px, 0)`;
  }
}

// reference collection
const _r = {
  monthsRef: null,
  daysRef: null,
  hoursRef: null,
  minutesRef: null,
  ddh: 0
}
let change;
let set;
/**
 * Date picker 
 * @param {*} param0 
 * @returns pocket component
 */
export const DatePicker = ({ callback, now=true }) => {
  const [ , setState ] = useState(null);
  const setMonthsRef = useRef(null);
  const setDaysRef = useRef(null);
  const setHourRef = useRef(null);
  const setMinRef = useRef(null);

  const renderComponent = ( s=Date.now() ) => {
    setState(s);
  }
  set = callback;
  change = ( ref, target ) => {
    calendarValues[target] = ref.value;
    if ( target === 'month' ) {
      calendarOptions.days = calendarOptions.calc('days');
      _r.daysRef.value > calendarValues.daysStatic && ( _r.daysRef.value = calendarValues.daysStatic );
      ddTransform(_r.daysRef);
      renderComponent();
    }
  }
  
  const ddScroll = event => {
    let hero = event.target.dataset.hero;
    ddHandler({ event, refs: [[hero]] });
  }

  useEffect(()=>{
    _r.monthsRef = setMonthsRef.current;
    _r.daysRef = setDaysRef.current;
    _r.hoursRef = setHourRef.current;
    _r.minutesRef = setMinRef.current;
    _r.monthsRef.dd = _r.monthsRef.nextElementSibling;
    _r.daysRef.dd = _r.daysRef.nextElementSibling;
    _r.hoursRef.dd = _r.hoursRef.nextElementSibling;
    _r.minutesRef.dd = _r.minutesRef.nextElementSibling;

    _r.ddh = _r.monthsRef.offsetHeight;

    ddHandler({
      refs: [
        _r.monthsRef,
        _r.daysRef,
        _r.hoursRef,
        _r.minutesRef
      ]
    });
    
  }, [])

  return(
    <div className="Date-Picker-Container">
      <div className="Group Date">
        <div className="Custom-Dropdown" onWheel={ ddScroll } data-hero={ 'months' }>
          <input className="Month" ref={ setMonthsRef } data-hero={ 'months' }
            defaultValue={ calendarValues.month || calendarValues.thisMonth }
          />
          <div className="Options-Container">
            { calendarOptions.months || calendarOptions.calc('months') }
          </div>
        </div>
        <h1>/</h1>
        <div className="Custom-Dropdown" onWheel={ ddScroll } data-hero={ 'days' }>
          <input className="Day" ref={ setDaysRef } data-hero={ 'days' }
            defaultValue={ calendarValues.day || calendarValues.today }
          />
          <div className="Options-Container">
            { calendarOptions.days || calendarOptions.calc('days') }
          </div>
        </div>
      </div>
      <div className="Group Time">
        <div className="Custom-Dropdown" onWheel={ ddScroll } data-hero={ 'hours' }>
          <input className="Hours" ref={ setHourRef } data-hero={ 'hours' }
            defaultValue={ calendarValues.hour || calendarValues.thisHour }
          />
          <div className="Options-Container">
            { calendarOptions.hours || calendarOptions.calc('hours') }
          </div>
        </div>
        <h1>:</h1>
        <div className="Custom-Dropdown" onWheel={ ddScroll } data-hero={ 'minutes' }>
          <input className="Minutes" ref={ setMinRef } data-hero={ 'minutes' }
            defaultValue={ calendarValues.minute || calendarValues.thisMinute }
          />
          <div className="Options-Container">
            { calendarOptions.minutes || calendarOptions.calc('minutes') }
          </div>
        </div>
      </div>
    </div>
  );
}


/**
 * Loading spinner
 */
export const Spinner = () => {
  const [ state, setState ] = useState(false);
  const [ fade, setFade ] = useState(false);

  const display = bool => {
    bool && setState(bool);
    bool && setTimeout(()=>{
      setFade(bool);
    }, 10);
    bool || setFade(bool);
    bool || setTimeout(()=>{
      setState(bool);
    }, 100);
  }

  useEffect(()=>{
    _gc.spinner = {
      display: display
    }
  }, []);
  
  return(
    <>
      { state && 
        <div className={ `Spinner-Overlay ${ fade ? 'fade' : '' }` }>
          <div className="Spinner-Container">
            <img className="Spinner" src={ SpinnerIcon } alt="Spinner Icon" />
          </div>
        </div> 
      }
    </>
  );
}