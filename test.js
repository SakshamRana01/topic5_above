const axios = require('axios');

describe('OpenStreetMap API', () => {
  const baseUrl = 'https://api.openstreetmap.org/api/0.6/';

  test('Get node by id - correct', async () => {
    const response = await axios.get(`${baseUrl}node/1`);
    expect(response.status).toBe(200);
  });

  test('Get node by id - incorrect', async () => {
    try {
      const response = await axios.get(`${baseUrl}node/-1`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('Get way by id - correct', async () => {
    const response = await axios.get(`${baseUrl}way/1`);
    expect(response.status).toBe(200);
  });

  test('Get way by id - incorrect', async () => {
    try {
      const response = await axios.get(`${baseUrl}way/-1`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('Get relation by id - correct', async () => {
    const response = await axios.get(`${baseUrl}relation/1`);
    expect(response.status).toBe(200);
  });

  test('Get relation by id - incorrect', async () => {
    try {
      const response = await axios.get(`${baseUrl}relation/-1`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('Search for node by location - correct', async () => {
    const response = await axios.get(`${baseUrl}map?bbox=-0.5,51.25,0,51.75`);
    expect(response.status).toBe(200);
    expect(response.data).toContain('<node');
  });

  test('Search for node by location - incorrect', async () => {
    const response = await axios.get(`${baseUrl}map?bbox=0,0,0,0`);
    expect(response.status).toBe(200);
    expect(response.data).not.toContain('<node');
  });

  test('Create node - correct', async () => {
    const requestBody = `
      <osm>
        <node lat="51.5" lon="-0.1" changeset="1" version="1" user="test" uid="1">
          <tag k="name" v="Test Node"/>
        </node>
      </osm>
    `;
    const response = await axios.put(`${baseUrl}node/create`, requestBody, {
      headers: { 'Content-Type': 'text/xml' }
    });
    expect(response.status).toBe(200);
  });

  test('Create node - incorrect', async () => {
    const requestBody = `
      <osm>
        <node lat="invalid" lon="values" changeset="1" version="1" user="test" uid="1">
          <tag k="name" v="Test Node"/>
        </node>
      </osm>
    `;
    try {
      const response = await axios.put(`${baseUrl}node/create`, requestBody, {
        headers: { 'Content-Type': 'text/xml' }
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });

  test('Update node - correct', async () => {
    const requestBody = `
      <osm>
        <node id="1" changeset="2" version="2" user="test" uid="1">
          <tag k="name" v="Updated Node"/>
        </node>
         `;
    const response = await axios.put(`${baseUrl}node/1`, requestBody, {
      headers: { 'Content-Type': 'text/xml' }
    });
    expect(response.status).toBe(200);
  });

  test('Update node - incorrect', async () => {
    const requestBody = `
      <osm>
        <node id="-1" changeset="2" version="2" user="test" uid="1">
          <tag k="name" v="Updated Node"/>
        </node>
      </osm>
    `;
    try {
      const response = await axios.put(`${baseUrl}node/-1`, requestBody, {
        headers: { 'Content-Type': 'text/xml' }
      });
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('Delete node - correct', async () => {
    const requestBody = `
      <osm>
        <node id="1" changeset="3" version="3" user="test" uid="1" visible="false"/>
      </osm>
    `;
    const response = await axios.put(`${baseUrl}node/1`, requestBody, {
      headers: { 'Content-Type': 'text/xml' }
    });
    expect(response.status).toBe(200);
  });

  test('Delete node - incorrect', async () => {
    try {
      const response = await axios.delete(`${baseUrl}node/-1`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
