import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { loadModules } from 'esri-loader';
import { ARCGIS_HOST, ARCGIS_HOST_JS, ARCGIS_HOST_CSS } from 'constants/index';

class AreaMap extends PureComponent {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/tasks/QueryTask', 'esri/tasks/support/Query', 'esri/layers/GraphicsLayer'], { css: false, url: ARCGIS_HOST_JS }).then(
      ([Map, MapView, QueryTask, Query, GraphicsLayer]) => {
        const HeadWork = ARCGIS_HOST;

        const resultsLayer = new GraphicsLayer();

        const map = new Map({
          basemap: 'streets',
          layers: [resultsLayer],
        });

        this.view = new MapView({
          container: this.mapRef.current,
          map,
          extent: {
            xmin: 11560164.8892,
            ymin: 140944.428599998,
            xmax: 11562932.5066877,
            ymax: 144710.942718225,
            spatialReference: 102100,
          },
        });

        this.view.when(() => {
          this.view.ui.add('optionsDiv', 'bottom-right');
          document.getElementById('attSelect').addEventListener('change', doQuery);
        });

        const queryTask = new QueryTask({
          url: HeadWork,
        });

        let attributeName = document.getElementById('attSelect');
        const query = new Query();
        query.returnGeometry = true;
        query.outFields = ['*'];

        if (attributeName.value === 'Postalcode') {
          query.where = 'Postalcode=18960';
        } else {
          query.where = attributeName.value + '>20';
        }
        queryTask.execute(query).then(function (results) {
          displayResults(results);
        });

        const a = document.getElementById('attSelect');
        a.addEventListener('change', doQuery, false);

        function doQuery() {
          attributeName = document.getElementById('attSelect');
          query.where = attributeName.value + '>20';
          queryTask.execute(query).then(function (results) {
            displayResults(results);
          });
        }

        function displayResults(results) {
          resultsLayer.removeAll();
          const features = results.features.map(function (graphic) {
            graphic.symbol = {
              type: 'simple-marker',
              style: 'circle', //'circle', 'cross', 'diamond', 'path', 'square', 'triangle', 'x'
              size: 8.5,
              color: 'darkorange',
            };
            return graphic;
          });
          resultsLayer.addMany(features);
        }
      },
    );
  }

  componentWillUnmount() {
    if (this.view) {
      this.view.container = null;
    }
  }

  render() {
    const { isHeaderHidden } = this.props;
    return (
      <div className="area_map">
        <Helmet>
          <link rel="stylesheet" href={`${ARCGIS_HOST_CSS}`} />
        </Helmet>
        <div className={`regionSelBox secHeader ${isHeaderHidden && 'd-none'}`}>
          <div className="row">
            <div className="col-md-4">
              <select defaultValue="Mosquito" className="esri-widget form-control" placeholder="Please select" id="attSelect">
                <option value="Mosquito">Mosquito</option>
                <option value="Rodent">Rodent</option>
                <option value="cluster">Cluster</option>
                <option value="Postalcode">Postal Code</option>
              </select>
            </div>
          </div>
        </div>
        <div id="viewDiv" ref={this.mapRef} style={{ width: '100%', height: '500px' }} />
      </div>
    );
  }
}

export default AreaMap;
