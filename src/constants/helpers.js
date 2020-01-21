export const deleteArray = (arr, id) => {
  return arr.filter(function(note) {
    return note.ID !== id;
  });
};

export const updateArray = (arr, note) => {
  var index = arr.findIndex(x => x.ID === note.ID);

  arr[index] = note;

  return arr;
};
