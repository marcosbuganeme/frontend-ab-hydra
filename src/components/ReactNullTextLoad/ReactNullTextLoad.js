import { ReactTableDefaults } from 'react-table';

const ReactNullTextLoad = () => null;
Object.assign(ReactTableDefaults, { NoDataComponent: ReactNullTextLoad });

export default ReactNullTextLoad;
