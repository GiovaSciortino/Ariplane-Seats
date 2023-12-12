const SEATSLARGE = [
  { id: 0, pos: "1A", isClicked: 0}, { id: 1, pos: "1B",isClicked: 0}, { id: 2, pos: "1C",isClicked: 0}, 
   { id: 3,  pos: "1D",isClicked: 2}, { id: 4, pos: "1E",isClicked: 0}, { id: 5,  pos: "1F", isClicked: 0},

   { id: 6,  pos: "2A", isClicked: 0}, { id: 8,  pos: "2B",isClicked: 0}, { id: 9, pos: "2C",isClicked: 0},
   { id: 4,  pos: "2D",isClicked: 2}, { id: 5, pos: "2E", isClicked: 2}, { id: 6,  pos: "2F",isClicked: 0},

    { id: 7,  pos: "3A", isClicked: 0}, { id: 8,  pos: "3B",isClicked: 0}, { id: 9, pos: "3C", isClicked: 2},
   { id: 4,  pos: "3D",isClicked: 0}, { id: 5, pos: "3E",isClicked: 0}, { id: 6,  pos: "3F",isClicked: 0}
];

const SEATSMEDIUM = [
  { id: 0, pos: "1A", isClicked: 0}, { id: 1, pos: "1B",isClicked: 0}, { id: 2, pos: "1C",isClicked: 0}, 
   { id: 3,  pos: "1D",isClicked: 0},

    { id: 6,  pos: "2A", isClicked: 0}, { id: 8,  pos: "2B",isClicked: 0}, { id: 9, pos: "2C",isClicked: 0},
   { id: 4,  pos: "2D",isClicked: 2},

    { id: 7,  pos: "3A", isClicked: 0}, { id: 8,  pos: "3B",isClicked: 0}, { id: 9, pos: "3C", isClicked: 2},
   { id: 4,  pos: "3D",isClicked: 0}
];

const SEATSSMALL = [
  [{ id: 0, pos: "1A", isClicked: 0}, { id: 1, pos: "1B",isClicked: 0}],

   [{ id: 2,  pos: "2A", isClicked: 0}, { id: 3,  pos: "2B",isClicked: 0}],

    [{ id: 4,  pos: "3A", isClicked: 0}, { id: 5,  pos: "3B",isClicked: 0}]
];


const PLANES = {
  'aereo-small':       { label: 'Aereo 1', url: 'plane/plane-small', size: 'small'},
  'aereo-medium':       { label: 'Aereo 2', url: 'plane/plane-medium', size: 'medium'},
  'aereo-large':       { label: 'Aereo 3', url: 'plane/plane-large', size: 'large'},
}

const PLANES2 = [
  {id: 0, size:'small', label: 'Aereo 1', url: 'plane/plane-small', numSeats: 6, nrows: 3, ncols: 2},

  {id: 1, size:'medium', label: 'Aereo 2', url: 'plane/plane-medium', numSeats: 12, nrows: 3, ncols: 4},
  
  {id: 2, size:'large', label: 'Aereo 3', url: 'plane/plane-large', numSeats: 18, nrows: 3, ncols: 6},
]




export  {SEATSLARGE, SEATSMEDIUM, SEATSSMALL, PLANES2};