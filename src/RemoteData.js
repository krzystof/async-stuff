const NOT_ASKED = 'NOT_ASKED'
const PENDING = 'PENDING'
const OK = 'OK'
const FAILED = 'FAILED'

class RemoteData {
  constructor(dataSrc) {
    this.dataSrc = dataSrc
    this.lifeCycle = NOT_ASKED
    this.data = null
  }

  get content() {
    if (this.isOk() || this.isFailed()) {
      return this.data
    }
    throw new Error('Cannot access the content of a Remote Data that is not Ok')
  }

  fetch() {
    if (!this.isNotAsked()) {
      return
    }

    this.lifeCycle = PENDING

    return this.dataSrc()
      .then(data => {
        this.lifeCycle = OK
        this.data = data
      })
      .catch(error => {
        this.lifeCycle = FAILED
        this.data = error
      })
  }

  isNotAsked() {
    return this.lifeCycle === NOT_ASKED
  }

  isPending() {
    return this.lifeCycle === PENDING
  }

  isOk() {
    return this.lifeCycle === OK
  }

  isFailed() {
    return this.lifeCycle === FAILED
  }
}

export default RemoteData
