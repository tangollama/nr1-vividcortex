import moment from "moment"

export const getTimeInterval = (timeRange) => {
  if (timeRange.duration) {
    const from = moment()
      .subtract(timeRange.duration, "ms")
      .unix()
    const until = moment().unix()

    return {from, until}
  }

  return { from: Math.ceil(timeRange.begin_time / 1000), until: Math.ceil(timeRange.end_time / 1000) }
}