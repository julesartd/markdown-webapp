import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ImageLibrary from './components/ImageLibrary/ImageLibrary';
import BlockList from './blocks/components/BlockList';
import Home from './components/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'images',
        element: <ImageLibrary onClose={() => window.history.back()} />,
      },
      {
        path: 'blocs',
        element: <BlockList onClose={() => window.history.back()} />,
      },
    ],
  },
]);
