import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardStats = ({ events }) => {
  // Calculate statistics
  const totalEvents = events.length;
  const pendingEvents = events.filter(event => event.status === 'pending').length;
  const approvedEvents = events.filter(event => event.status === 'approved').length;
  const rejectedEvents = events.filter(event => event.status === 'rejected').length;

  // Prepare data for status distribution pie chart
  const statusData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [pendingEvents, approvedEvents, rejectedEvents],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',  // Yellow for pending
          'rgba(75, 192, 192, 0.8)',  // Green for approved
          'rgba(255, 99, 132, 0.8)',  // Red for rejected
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for timeline chart
  const timelineData = {
    labels: Array.from(new Set(events.map(event => 
      new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ))).sort(),
    datasets: [
      {
        label: 'Events per Day',
        data: Array.from(new Set(events.map(event => 
          new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ))).map(date => 
          events.filter(event => 
            new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === date
          ).length
        ),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for time slot distribution
  const timeSlots = events.reduce((acc, event) => {
    acc[event.time] = (acc[event.time] || 0) + 1;
    return acc;
  }, {});

  const timeSlotData = {
    labels: Object.keys(timeSlots),
    datasets: [
      {
        label: 'Events per Time Slot',
        data: Object.values(timeSlots),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Events</h3>
          <p className="text-3xl font-bold text-blue-600">{totalEvents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingEvents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{approvedEvents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{rejectedEvents}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Status Distribution</h3>
          <div className="h-64">
            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Events Timeline</h3>
          <div className="h-64">
            <Line 
              data={timelineData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Time Slot Distribution */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Time Slot Distribution</h3>
          <div className="h-64">
            <Bar 
              data={timeSlotData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 