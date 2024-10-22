import { registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(...registerables);
import { CategoryScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(CategoryScale);