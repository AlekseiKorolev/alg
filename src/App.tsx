import './App.css';

import TaskComponent from './components/task/Task';

import leet289 from './tasks/leet-289';

const App = () => {
  return (
    <div className="App">
      <TaskComponent item={leet289}></TaskComponent>
    </div>
  );
}

export default App;
