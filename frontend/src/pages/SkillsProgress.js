import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../authContext";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "./SkillsProgress.css"; // CSS import

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SkillsProgress = () => {
  const { user } = useAuth();
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.userId) {
      setError("You need to log in to view your skills progress.");
      setLoading(false);
      return;
    }

    const fetchSkillsData = async () => {
      try {
        const response = await axios.get(
          `https://skillsnap-gyex.onrender.com/api/skills/?userId=${user.userId}`
        );
        setSkillsData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, [user]);

  const aggregatedData = skillsData.reduce((acc, skill) => {
    const date = new Date(skill.dateGained).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(aggregatedData).sort();
  let cumulativeSkills = 0;
  const cumulativeData = sortedDates.map((date) => {
    cumulativeSkills += aggregatedData[date];
    return cumulativeSkills;
  });

  const proficiencyData = skillsData.reduce((acc, skill) => {
    const proficiency = skill.proficiency;
    acc[proficiency] = (acc[proficiency] || 0) + 1;
    return acc;
  }, {});

  const proficiencyChartData = {
    labels: ["0", "1", "2"],
    datasets: [
      {
        label: "Skills by Proficiency",
        data: [
          proficiencyData[0] || 0,
          proficiencyData[1] || 0,
          proficiencyData[2] || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Cumulative Skills Gained Over Time",
        data: cumulativeData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
    ],
  };

  return (
    <div className="skills-container">
      <h1 className="skills-title">📊 Skills Progress Dashboard</h1>
      {loading ? (
        <p className="skills-loading">Loading...</p>
      ) : error ? (
        <p className="skills-error">{error}</p>
      ) : (
        <div className="charts-wrapper">
          <div className="chart-card">
            <h2 className="chart-title">📈 Cumulative Skills Over Time</h2>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Dates",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Skills Gained",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <div className="chart-card">
            <h2 className="chart-title">📊 Skills by Proficiency</h2>
            <Bar
              data={proficiencyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: "y",
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Number of Skills",
                    },
                    beginAtZero: true,
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Proficiency",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsProgress;
