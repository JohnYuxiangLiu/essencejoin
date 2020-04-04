

exports.getOverview=(req, res) => {
    res.status(200).render("overview", {
      data: "overview data"
    });
  };

exports.getActivity=(req, res) => {
    res.status(200).render("activity", {
      data: "activity data"
    });
  };

