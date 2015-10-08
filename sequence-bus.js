import Bus from "./bus";
import pipe from "./internal/pipe-stream";
import extend from "./internal/extend";
import AsyncResponse from "./async-response";

/**
 */

function SequenceBus(busses) {
  this._busses = busses;
}

/**
 */

extend(Bus, SequenceBus, {

  /**
   */

  execute: function(operation) {
    return new AsyncResponse((writable) => {

      // copy incase the collection mutates (unlikely but possible)
      var busses = this._busses.concat();

      var next = (i) => {
        if (i === busses.length) return writable.end();
        pipe(busses[i].execute(operation), writable, { end: false }).then(() => next(i + 1));
      };

      next(0);
    });
  }
});

/**
 */

module.exports = SequenceBus;