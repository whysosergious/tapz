import './App.css';
import './AppGeneral.css';
import './fonts.css';
import './typography.css';

// components
import Board from 'MainView/Board';

function App() {
  return (
    <div className="App">
      <Board />
    </div>
  );
}

export default App;


// console.log(matchGenre);
//             if ( matchGenre ) {
            	
//             } else {
//             return;
//             }

// let specialChars:	{
//   'é': 'e',
//   'á': 'a',
// }

// background: rgb(209,236,231);
    // background: linear-gradient(0deg, rgba(209,236,231,1) 0%, rgba(248,246,255,1) 72%, rgba(215,244,243,1) 100%);


// let matchGenre: boolean = artist.genres.forEach(g => {
//   console.log(rex.test(g));
//   return true;
// });