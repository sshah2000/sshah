# i.) Clustering Analysis 

# Random Sample a dataset that contains 90% of the data points. Iris, 
# perform a K-mean clustering  and hierarchial clustering
# Try different numbers and interpret findings 

library(fpc)

data(iris)
iris_1 = iris[sample(nrow(iris), nrow(iris) * 0.9), ]

# K Mean Clustering Analysis
fit <- kmeans(iris_1[,1:4], 5) # This would represent a 5 cluster solution
table(fit$cluster)

plotcluster(iris_1[,1:4], fit$cluster)

# After I had plotted it, I wanted to see what is in each group
iris_1$Species[fit$cluster == 1] 

fit$centers # This would provide the cluster means 

# This would be Wards Method 
iris.dist = dist(iris_1[,1:4])
iris.hclust = hclust(iris.dist, method = "ward.D")
plot(iris.hclust)

# Looking at the denogram, we are able to see multiple levels within it

# We are going to be cutting it 3 levels to understand the cluster relationships

groupIris.2 = cutree(iris.hclust, k = 2)
table(groupIris.2)

iris_1$Species[groupIris.2 == 2]

aggregate(iris_1[,1:4], by = list(groupIris.2), FUN = mean)
plotcluster(iris_1[,1:4], groupIris.2)


## Association Rules ------------------------------------------------

# 1.) Preliminaries 
library(arules)
data("Groceries")


# Data Exploration 

# What are the dimensions of the grocery dataset
summary(Groceries)
# We are able to see that there are 9835 rows and 169 columns 

# Print out the first 10 transactions 
inspect(Groceries[1:10])

# What was the most frequently purchased item
# This would be whole milk, look at either Frequency Item Plot or summary. Milk was purchased 1/4 of time when shopping. 

# Average Transaction involved how many items:
# this would be 4.4 items 

#Largest transaction: 
# 32 items 

# Frequency of Each item
itemFrequency(Groceries)

itemFrequencyPlot(Groceries)
# This will show for all items with no support, or possibly a very small support

itemFrequencyPlot(Groceries, support = 0.1, cex.names = 0.785) 
# This will display the item frequency plot with a support of 10%, this drastically cut 
# it down. We are able to show that milk is bought 1/4 of the time each transaction 

## Association Rules ### ## ## ##

# This is an example on if I have a low support and a low confidence.
# An item combination LHS and RHS appear atleast 0.1% of the total transaction to be considered - support
# Confidence 1% where when RHS is bought, so is LHS. 
rules <- apriori(Groceries, parameter = list(support = 0.001, confidence = 0.01))
length(rules)

# With low parameters, we are able to see approximately more than 10,000 vales. 

# As we can see, when we change it up to a support of 2.5% and a confidence of 10%, 
# only 75 rules were written 
rules <- apriori(Groceries, parameter = list(support = 0.025, confidence = 0.1))
length(rules)

summary(rules)
# 8 rules involve 1 items, and 67 rules involve 2 items. 
# average of the lift is 1.4945

inspect(rules)

# using the inspect rules to see by lift 
inspect(head(sort(rules, by = "lift"), n = 10))

# Rule 1: {root vegetables} <=> {other vegetables}
# Customers who buy root vegetables are 2.25 times more likely to buy other vegetables, and vice versa.
# This association occurs in 4.74% of transactions and is based on 466 instances.

# Rule 2: {whipped/sour cream} <=> {other vegetables}
# Customers who buy whipped/sour cream are 2.08 times more likely to buy other vegetables, and vice versa.
# This relationship is present in 2.89% of transactions, covering 284 instances.

# Rule 3: {tropical fruit} <=> {yogurt}
# Customers who buy tropical fruit are 2.00 times more likely to buy yogurt, and vice versa.
# This association occurs in 2.93% of transactions, based on 288 instances.

# Rule 4: {butter} <=> {whole milk}
# Customers who buy butter are 1.95 times more likely to buy whole milk, and vice versa.
# This association occurs in 2.76% of transactions, based on 271 instances.

# Rule 5: {curd} <=> {whole milk}
# Customers who buy curd are 1.92 times more likely to buy whole milk, and vice versa.
# This relationship is present in 2.61% of transactions, covering 257 instances.



