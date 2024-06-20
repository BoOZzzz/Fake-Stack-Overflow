
import Header from './header.js';
import Questions from '../pages/questions.js';
import SideBar from './sidebar.js';
export default function fakeStackOverflow() {
  return (
    <>
      <Header />
      <SideBar />
      <Questions  />
    </>
  );
}
