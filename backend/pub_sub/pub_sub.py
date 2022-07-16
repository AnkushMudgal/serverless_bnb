import google.api_core.exceptions
from google.cloud import pubsub_v1
from google.oauth2 import service_account


def get_publisher_client():
    cred = service_account.Credentials.from_service_account_file(
        filename='serverless-5410-b00885768-b44ede3d01d5.json')
    return pubsub_v1.PublisherClient(credentials=cred)


def get_subscription_client():
    cred = service_account.Credentials.from_service_account_file(
        filename='serverless-5410-b00885768-b44ede3d01d5.json')
    return pubsub_v1.SubscriberClient(credentials=cred)


def create_topic(project_id, topic_id):
    publisher = get_publisher_client()
    topic_path = publisher.topic_path(project_id, topic_id)
    try:
        topic = publisher.create_topic(request={"name": topic_path})
        return {"success": "Topic created successfully"}
    except google.api_core.exceptions.AlreadyExists:
        return {"success": "Topic already exists"}


def create_subscription(project_id, topic_id, subscription_id):
    publisher = get_publisher_client()
    subscriber = get_subscription_client()

    topic_path = publisher.topic_path(project_id, topic_id)
    subscription_path = subscriber.subscription_path(project_id, subscription_id)
    try:
        with subscriber:
            subscription = subscriber.create_subscription(
                request={"name": subscription_path, "topic": topic_path}
            )
        return {"success": "Subscription created successfully"}
    except google.api_core.exceptions.AlreadyExists:
        return {"success": "Subscription already exists"}


def publish_messages(project_id, topic_id, message):
    publisher = get_publisher_client()
    topic_path = publisher.topic_path(project_id, topic_id)
    try:
        future = publisher.publish(topic_path, message.encode("utf-8"))
        return {"success": f"Published messages to {topic_path}"}
    except Exception as e:
        return {"error": "Internal Server Error"}


def pull_messages(project_id, subscription_id):
    subscriber = get_subscription_client()
    subscription_path = subscriber.subscription_path(project_id, subscription_id)

    def callback(message):
        print(f"Received {message}.")
        message.ack()

    streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)

    with subscriber:
        try:
            streaming_pull_future.result()
        except TimeoutError:
            streaming_pull_future.cancel()
            streaming_pull_future.result()

def message_passing(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    response = {}
    if "type" in request_json and "values" in request_json:
        current_type, values = request_json["type"], request_json["values"]
        if current_type == "CREATE_TOPIC":
            response = create_topic(values["project_id"], values["topic_id"])
        elif current_type == "CREATE_SUBSCRIPTION":
            response = create_subscription(values["project_id"], values["topic_id"], values['subscription_id'])
        elif current_type == "PUBLISH_MESSAGES":
            response = publish_messages(values["project_id"], values["topic_id"], values['message'])

    return response


if __name__ == "__main__":
    project_id = "serverless-5410-b00885768"
    topic_id = "food-order"
    subscription_id = "food-order-subscription"

    # print(create_topic(project_id, topic_id))
    # print(create_subscription(project_id, topic_id, subscription_id))
    # print(publish_messages(project_id, topic_id, "Order 10 successfully Placed"))
    # pull_messages(project_id, subscription_id)
