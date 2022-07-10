import fs from 'fs';
import dirTree from 'directory-tree';
import path from 'path';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartTypeRegistry } from 'chart.js';

const render = async () => {
  const targetDirectory = 'hoge';
  const ditTree = dirTree(path.join(process.cwd(), targetDirectory))
  const dataFileList = ditTree.children.map(el => el.children.find(el => el.path.match(/result.json$/))?.path).filter(el => el);
  const dataList = dataFileList.map(filePath => {
    const file = fs.readFileSync(filePath, 'utf-8');
    const { score } = JSON.parse(file).all;
    const { date } = filePath.match(new RegExp(`${targetDirectory}/(?<date>.+)/result.json`)).groups;
    return { date, score };
  })
  console.log(dataList);
  const options = {
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  }
  const tagetLineDataset = {
    label: 'score=80',
    fill: false,
    borderColor: 'rgb(255, 0, 0)',
    tension: 0,
    borderWidth: 1,
    borderDash: [10, 10],
    pointRadius: 0,
    data: dataList.map(el => {
      return {
        x: el.date,
        y: 80,
      }
    })
  }
  const config = {
    type: 'line' as keyof ChartTypeRegistry,
    data: {
      datasets: [
        {
          label: 'score',
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0,
          data: dataList.map(el => {
            return {
              x: el.date,
              y: el.score,
            }
          })
        },
        tagetLineDataset,
      ]
    },
    options
  }
  const width = 800;
  const height = 600;
  const backgroundColour = 'white';
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});
  const image = await chartJSNodeCanvas.renderToBuffer(config as any);
  fs.writeFileSync(`./result.jpg`, image, 'binary');

}
render();
